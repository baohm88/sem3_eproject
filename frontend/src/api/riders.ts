// src/api/riders.ts
import api from "./axios";
import type {
  RiderProfile,
  PageResult,
  Wallet,
  Transaction,
  Order,
  Review, // ← make sure Review is declared in src/api/types.ts
} from "./types";

/**
 * -----------------------------------------------------------------------------
 * Riders API
 * -----------------------------------------------------------------------------
 * Thin wrappers over backend endpoints related to the Rider role:
 *  - Rider profile (self)
 *  - Rider wallet & transactions
 *  - Orders (create/list/cancel)
 *  - Reviews (create/list)
 *
 * Conventions:
 *  - All functions use the shared Axios instance with interceptors (see
 *    `src/api/axios.ts`) and return the **unwrapped** payload (`res.data.data`).
 *  - Monetary fields named `*Cents` are integers. For VND you may not need
 *    to divide by 100 (check your backend contract).
 *  - `PageResult<T>` is a standard pagination envelope (page is 1-based).
 * -----------------------------------------------------------------------------
 */

/* =============================================================================
 * Profile (self)
 * =============================================================================
 */

/**
 * Get the authenticated rider's own profile.
 *
 * Backend: GET /api/riders/me
 *
 * @returns RiderProfile
 */
export async function getMyRider() {
  const res = await api.get("/api/riders/me");
  return res.data.data as RiderProfile;
}

/**
 * Update the authenticated rider's profile.
 *
 * Backend: PUT /api/riders/me
 *
 * @param payload - Partial rider fields to update.
 * @returns RiderProfile (updated)
 *
 * NOTE: `console.log` below is useful in development but noisy in production.
 */
export async function updateMyRider(payload: Partial<RiderProfile>) {
  const res = await api.put("/api/riders/me", payload);
  console.log("update rider: ", res); // TODO: remove or guard for production
  return res.data.data as RiderProfile;
}

/* =============================================================================
 * Public / by id
 * =============================================================================
 */

/**
 * List riders (public search/browse).
 *
 * Backend: GET /api/riders
 *
 * @param params - Pagination/filter/sort options:
 *   - page?: number (1-based)
 *   - size?: number
 *   - sort?: string (e.g., "fullName:asc", "createdAt:desc")
 *   - q?: string (search by name/keywords)
 * @returns PageResult<RiderProfile>
 */
export async function listRiders(params: Record<string, any> = {}) {
  const res = await api.get("/api/riders", { params });
  return res.data.data as PageResult<RiderProfile>;
}

/**
 * Get a rider profile by user id (public view).
 *
 * Backend: GET /api/riders/{userId}
 */
export async function getRider(userId: string) {
  const res = await api.get(`/api/riders/${userId}`);
  return res.data.data as RiderProfile;
}

/* =============================================================================
 * Wallet & Transactions
 * =============================================================================
 */

/**
 * Get rider's wallet (balance, thresholds, etc.).
 *
 * Backend: GET /api/riders/{userId}/wallet
 */
export async function getWallet(userId: string) {
  const res = await api.get(`/api/riders/${userId}/wallet`);
  return res.data.data as Wallet;
}

/**
 * List rider's transactions.
 *
 * Backend: GET /api/riders/{userId}/transactions
 *
 * @param params - Pagination/filter:
 *   - page?: number (1-based)
 *   - size?: number
 *   - sort?: string (if supported)
 * @returns PageResult<Transaction>
 */
export async function listTransactions(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/riders/${userId}/transactions`, { params });
  return res.data.data as PageResult<Transaction>;
}

/**
 * Top up rider wallet.
 *
 * Backend: POST /api/riders/{userId}/wallet/topup
 *
 * @param payload - { amountCents, idempotencyKey? }
 * @returns Backend-defined payload (e.g., updated wallet or a receipt)
 *
 * TIP: Provide a stable `idempotencyKey` to avoid duplicate topups on retries.
 */
export async function topup(
  userId: string,
  payload: { amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(`/api/riders/${userId}/wallet/topup`, payload);
  return res.data.data;
}

/**
 * Withdraw from rider wallet.
 *
 * Backend: POST /api/riders/{userId}/wallet/withdraw
 *
 * @param payload - { amountCents, idempotencyKey? }
 */
export async function withdraw(
  userId: string,
  payload: { amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(
    `/api/riders/${userId}/wallet/withdraw`,
    payload
  );
  return res.data.data;
}

/* =============================================================================
 * Orders
 * =============================================================================
 */

/**
 * Create an order (rider books a company's service).
 *
 * Backend: POST /api/riders/{userId}/orders
 *
 * @param payload - { companyId, serviceId }
 * @returns Order (created)
 */
export async function createOrder(
  userId: string,
  payload: { companyId: string; serviceId: string }
) {
  const res = await api.post(`/api/riders/${userId}/orders`, payload);
  return res.data.data as Order;
}

/**
 * List rider's orders.
 *
 * Backend: GET /api/riders/{userId}/orders
 *
 * @param params - Pagination/filter/sort as supported by the backend.
 * @returns PageResult<Order>
 */
export async function listOrders(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/riders/${userId}/orders`, { params });
  return res.data.data as PageResult<Order>;
}

/**
 * Cancel an order.
 *
 * Backend: POST /api/riders/{userId}/orders/{orderId}/cancel
 *
 * @returns Order (updated)
 */
export async function cancelOrder(userId: string, orderId: string) {
  const res = await api.post(
    `/api/riders/${userId}/orders/${orderId}/cancel`
  );
  return res.data.data as Order;
}

/* =============================================================================
 * Reviews
 * =============================================================================
 */

/**
 * Create a review for an order.
 *
 * Backend: POST /api/riders/{userId}/orders/{orderId}/reviews
 *
 * @param payload - { rating: number (1–5), comment?: string }
 * @returns Review
 */
export async function reviewOrder(
  userId: string,
  orderId: string,
  payload: { rating: number; comment?: string }
) {
  const res = await api.post(
    `/api/riders/${userId}/orders/${orderId}/reviews`,
    payload
  );
  return res.data.data as Review;
}

/**
 * List reviews written by this rider.
 *
 * Backend: GET /api/riders/{userId}/reviews
 *
 * @param params - Pagination/filter as supported by the backend.
 * @returns PageResult<Review>
 */
export async function listMyReviews(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/riders/${userId}/reviews`, { params });
  return res.data.data as PageResult<Review>;
}
