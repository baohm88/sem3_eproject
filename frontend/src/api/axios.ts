// src/api/axios.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * -----------------------------------------------------------------------------
 * Axios instance & API error normalization
 * -----------------------------------------------------------------------------
 * This module exports a pre-configured Axios instance (`api`) with:
 *  - A single place to configure the API base URL.
 *  - Request interceptor that auto-attaches the Bearer token (if available).
 *  - Response interceptor that:
 *      * Unwraps server responses shaped as `{ success, data, error }`.
 *      * Normalizes failures into a consistent `AppError` for the UI layer.
 *  - Pluggable token getter and custom 401 handler hooks.
 *
 * You can customize token retrieval via `setTokenGetter`, and override the
 * default 401 behavior via `setOnUnauthorized`.
 * -----------------------------------------------------------------------------
 */

/** ---- Runtime config ----
 * Resolve the API base URL from (in order):
 *  1) VITE env var (build-time) `VITE_API_BASE_URL`
 *  2) A runtime-injected global `window.__API_BASE_URL__`
 *  3) Fallback to local default `http://localhost:5000`
 */
const ENV_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (window as any).__API_BASE_URL__ || // allow runtime override through a global (e.g., injected by the host page)
  "http://localhost:5000";

/** ---- AppError: a UI-friendly error shape ----
 * Use this error type everywhere in the UI. It carries:
 *  - `message`: human-readable message
 *  - `code`:    optional machine-readable error code from the server
 *  - `status`:  HTTP status (if any)
 *  - `details`: any extra payload returned by the server for debugging/UX
 */
export class AppError extends Error {
  code?: string;
  status?: number;
  details?: any;

  constructor(message: string, opts?: { code?: string; status?: number; details?: any }) {
    super(message);
    this.name = "AppError";
    this.code = opts?.code;
    this.status = opts?.status;
    this.details = opts?.details;
  }
}

/** ---- Token management (can be replaced later) ----
 * By default, we read the token from `localStorage.token`. Override with
 * `setTokenGetter(() => myToken)` if your app stores it elsewhere.
 *
 * For 401 Unauthorized responses, we provide a default handler that:
 *  - Clears local session (token + profile).
 *  - Redirects to `/login?reason=unauthorized` unless already on an /auth route.
 * You can override this behavior using `setOnUnauthorized(...)`.
 */
let _tokenGetter: () => string | null = () => localStorage.getItem("token");
let _onUnauthorized: (err: AppError) => void = (err) => {
  // Default: clear token/profile & soft-redirect to login
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
  } catch {}
  if (!location.pathname.startsWith("/auth")) {
    window.location.assign("/login?reason=unauthorized");
  }
};

/** Provide a custom function to retrieve the auth token (e.g., from memory, cookie, etc.). */
export function setTokenGetter(fn: () => string | null) {
  _tokenGetter = fn;
}

/** Provide a custom 401 handler (e.g., open a reauth modal instead of redirecting). */
export function setOnUnauthorized(handler: (err: AppError) => void) {
  _onUnauthorized = handler;
}

/** ---- Create Axios instance ---- */
const api: AxiosInstance = axios.create({
  baseURL: ENV_BASE,
  timeout: 15000,
});

/** ---- Helpers ----
 * `buildAppError` converts any thrown error (especially Axios errors) into our
 * standardized `AppError`. It extracts useful fields like HTTP status, server
 * error code, and message from typical API responses (see below).
 */
function buildAppError(axErr: any): AppError {
  // Is it an AxiosError?
  const aerr: AxiosError | undefined = axErr?.isAxiosError ? axErr : undefined;
  const status = aerr?.response?.status;

  // Expected server envelope: { success, data, error: { code, message, details } }
  const data = aerr?.response?.data as any;
  const code = data?.error?.code;
  const message =
    data?.error?.message ||
    data?.message ||
    aerr?.message ||
    "Network error";
  const details = data?.error?.details ?? data;

  return new AppError(message, { code, status, details });
}

/**
 * `unwrapApiResponse` supports both:
 *  - Envelope: `{ success: boolean, data: T, error?: {...} }`
 *  - Raw JSON payloads (no envelope)
 *
 * If the envelope exists and `success === false`, it throws `AppError`.
 * Otherwise, it returns the parsed body. For compatibility with legacy code,
 * the response interceptor below still returns the full Axios response object,
 * but with `data` replaced by the unwrapped body.
 */
function unwrapApiResponse(res: any) {
  const body = res?.data;

  // Envelope style: `{ success, data, error }`
  if (body && typeof body === "object" && "success" in body) {
    if (body.success === false) {
      throw new AppError(body?.error?.message || "API error", {
        code: body?.error?.code,
        details: body?.error?.details,
        status: res?.status,
      });
    }
    return body; // Keep full envelope to allow caller to read `body.data`.
  }

  // Raw payload (no envelope)
  return body;
}

/** ---- Interceptors ---- */
/** Request: attach Authorization header if a token is available. */
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = _tokenGetter?.();
  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  return cfg;
});

/**
 * Response:
 *  - On success: unwrap `{ success, data, error }` if present.
 *    We still return the Axios response object, but with its `data` replaced
 *    by the unwrapped body for convenience.
 *  - On failure: normalize to `AppError`. If HTTP 401 is detected, call the
 *    customizable `_onUnauthorized` hook (default redirects to login).
 */
api.interceptors.response.use(
  (res) => {
    // Unwrap ApiResponse<T> style payloads; if raw, return as-is.
    const body = unwrapApiResponse(res);

    // Preserve the rest of Axios response while replacing `data`.
    return { ...res, data: body };
  },
  (error) => {
    const appErr = buildAppError(error);

    // 401: let the app decide how to handle re-auth (default: redirect to login).
    if (appErr.status === 401) {
      try {
        _onUnauthorized(appErr);
      } catch {
        // swallow hook errors to avoid infinite loops
      }
    }

    return Promise.reject(appErr);
  }
);

export default api;
