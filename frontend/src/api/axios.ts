import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/** ---- Runtime config ---- **/
const ENV_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (window as any).__API_BASE_URL__ || // cho phép override lúc runtime (injected global)
  "http://localhost:5000";

/** ---- AppError: lỗi chuẩn hóa cho UI ---- **/
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

/** ---- Token management (có thể thay đổi sau này) ---- **/
let _tokenGetter: () => string | null = () => localStorage.getItem("token");
let _onUnauthorized: (err: AppError) => void = (err) => {
  // Mặc định: clear & điều hướng login nhẹ nhàng
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
  } catch {}
  if (!location.pathname.startsWith("/login")) {
    window.location.assign("/login?reason=unauthorized");
  }
};

export function setTokenGetter(fn: () => string | null) {
  _tokenGetter = fn;
}

export function setOnUnauthorized(handler: (err: AppError) => void) {
  _onUnauthorized = handler;
}

/** ---- Tạo instance ---- **/
const api: AxiosInstance = axios.create({
  baseURL: ENV_BASE,
  timeout: 15000,
});

/** ---- Helpers ---- **/
function buildAppError(axErr: any): AppError {
  // AxiosError?
  const aerr: AxiosError | undefined = axErr?.isAxiosError ? axErr : undefined;
  const status = aerr?.response?.status;

  // BE chuẩn { success, data, error: { code, message, details } }
  const data = aerr?.response?.data;
  const code = data?.error?.code;
  const message =
    data?.error?.message ||
    data?.message ||
    aerr?.message ||
    "Network error";
  const details = data?.error?.details ?? data;

  return new AppError(message, { code, status, details });
}

function unwrapApiResponse(res: any) {
  // Hỗ trợ cả 2 kiểu: {success,data,error} hoặc raw JSON thuần
  const body = res?.data;
  if (body && typeof body === "object" && "success" in body) {
    if (body.success === false) {
      throw new AppError(body?.error?.message || "API error", {
        code: body?.error?.code,
        details: body?.error?.details,
        status: res?.status,
      });
    }
    return body; // vẫn trả nguyên để caller lấy body.data
  }
  return body;
}

/** ---- Interceptors ---- **/
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = _tokenGetter?.();
  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => {
    // Unwrap kiểu ApiResponse<T>; nếu raw thì trả raw
    const body = unwrapApiResponse(res);
    // để tương thích code cũ: vẫn trả res nhưng gắn body “đã unwrap”
    return { ...res, data: body };
  },
  (error) => {
    const appErr = buildAppError(error);

    // 401: cho hook custom xử lý (redirect, popup…), mặc định redirect
    if (appErr.status === 401) {
      try {
        _onUnauthorized(appErr);
      } catch {
        // ignore hook errors
      }
    }
    return Promise.reject(appErr);
  }
);

export default api;
