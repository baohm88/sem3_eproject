// src/api/drivers.ts
import api from "./axios";
import type {
  DriverProfile,
  PageResult,
  Wallet,
  Transaction,
  Company,
  Invite,
  JobApplication,
  DriverPublicProfile,
  Employment,
} from "./types";

/**
 * -----------------------------------------------------------------------------
 * Drivers API
 * -----------------------------------------------------------------------------
 * Thin wrappers over backend endpoints related to the Driver role:
 *  - Profile (current driver and public driver pages)
 *  - Availability
 *  - Wallet & Transactions
 *  - Company discovery from the driver's perspective
 *  - Applications & Invitations
 *  - Employment status
 *
 * All functions use the shared Axios instance (`api`) with interceptors defined
 * in `src/api/axios.ts`. Successful calls return the **unwrapped** payload
 * (`res.data.data` according to our `{ success, data, error }` envelope). Errors
 * are normalized into `AppError` by the interceptor.
 * -----------------------------------------------------------------------------
 */

/* =============================================================================
 * Profile (me)
 * =============================================================================
 */

/**
 * Get the authenticated driver's own profile.
 *
 * Backend: GET /api/drivers/me
 *
 * @returns DriverProfile
 */
export async function getMyDriverProfile() {
  const res = await api.get("/api/drivers/me");
  return res.data.data as DriverProfile;
}

/**
 * Update the authenticated driver's profile.
 *
 * Backend: PUT /api/drivers/me
 *
 * @param payload - Partial driver fields to update.
 * @returns DriverProfile (updated)
 */
export async function updateMyDriverProfile(payload: Partial<DriverProfile>) {
  const res = await api.put("/api/drivers/me", payload);
  return res.data.data as DriverProfile;
}

/* =============================================================================
 * Public / by id
 * =============================================================================
 */

/**
 * List public driver profiles (search/browse).
 *
 * Backend: GET /api/drivers
 *
 * @param params - Pagination/filter/sort options:
 *   - page?: number (1-based)
 *   - size?: number
 *   - sort?: string (e.g., "rating:desc", "fullName:asc")
 *   - q?: string (search by name/keywords)
 *   - isAvailable?: boolean
 * @returns PageResult<DriverProfile>
 */
export async function listDrivers(params: Record<string, any> = {}) {
  const res = await api.get("/api/drivers", { params });
  return res.data.data as PageResult<DriverProfile>;
}

/**
 * Get a specific driver's profile by user id (public view).
 *
 * Backend: GET /api/drivers/{userId}
 */
export async function getDriverProfile(userId: string) {
  const res = await api.get(`/api/drivers/${userId}`);
  return res.data.data as DriverProfile;
}

/* =============================================================================
 * Availability
 * =============================================================================
 */

/**
 * Update driver's availability flag (e.g., ready to receive invites/jobs).
 *
 * Backend: POST /api/drivers/{userId}/availability
 *
 * @param userId      - Driver's user id.
 * @param isAvailable - Whether the driver is available.
 * @returns DriverProfile (updated)
 */
export async function updateDriverAvailability(
  userId: string,
  isAvailable: boolean
) {
  const res = await api.post(`/api/drivers/${userId}/availability`, {
    isAvailable,
  });
  return res.data.data as DriverProfile;
}

/* =============================================================================
 * Wallet & Transactions
 * =============================================================================
 */

/**
 * Get driver's wallet (balance, thresholds, etc.).
 *
 * Backend: GET /api/drivers/{userId}/wallet
 */
export async function getDriverWallet(userId: string) {
  const res = await api.get(`/api/drivers/${userId}/wallet`);
  return res.data.data as Wallet;
}

/**
 * Top up driver's wallet.
 *
 * Backend: POST /api/drivers/{userId}/wallet/topup
 *
 * @param payload - { amountCents, idempotencyKey? }
 * @returns Backend-defined payload (e.g., updated wallet or a receipt)
 */
export async function topupDriverWallet(
  userId: string,
  payload: { amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(`/api/drivers/${userId}/wallet/topup`, payload);
  return res.data.data;
}

/**
 * Withdraw from driver's wallet.
 *
 * Backend: POST /api/drivers/{userId}/wallet/withdraw
 *
 * @param payload - { amountCents, idempotencyKey? }
 */
export async function withdrawFromDriverWallet(
  userId: string,
  payload: { amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(
    `/api/drivers/${userId}/wallet/withdraw`,
    payload
  );
  return res.data.data;
}

/**
 * List driver's transactions.
 *
 * Backend: GET /api/drivers/{userId}/transactions
 *
 * @param params - Pagination/filter options: { page?, size?, sort?, ... }
 * @returns PageResult<Transaction>
 */
export async function listDriverTransactions(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/drivers/${userId}/transactions`, {
    params,
  });
  return res.data.data as PageResult<Transaction>;
}

/* =============================================================================
 * Companies & Applications (driver’s perspective)
 * =============================================================================
 */

/**
 * Discover companies relevant to a driver (personalized/company filters).
 *
 * Backend: GET /api/drivers/{userId}/companies
 *
 * @param params - Pagination/filter/sort options.
 * @returns PageResult<Company>
 */
export async function listCompaniesForDriver(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/drivers/${userId}/companies`, { params });
  return res.data.data as PageResult<Company>;
}

/**
 * Apply to a company as a driver.
 *
 * Backend: POST /api/drivers/{userId}/applications
 *
 * @param payload - { companyId: string; expiresAt?: string (ISO) }
 * @returns JobApplication (created)
 */
export async function applyToCompanyAsDriver(
  userId: string,
  payload: { companyId: string; expiresAt?: string }
) {
  const res = await api.post(`/api/drivers/${userId}/applications`, payload);
  return res.data.data as JobApplication;
}

/**
 * Cancel a previously submitted application.
 *
 * Backend: DELETE /api/drivers/{userId}/applications/{applicationId}
 */
export async function cancelApplication(userId: string, applicationId: string) {
  const res = await api.delete(
    `/api/drivers/${userId}/applications/${applicationId}`
  );
  return res.data.data;
}

/**
 * List driver's applications.
 *
 * Backend: GET /api/drivers/{userId}/applications
 *
 * @param params - { page?, size?, status? ("Applied" | "Rejected" | ...), ... }
 * @returns PageResult<JobApplication>
 */
export async function listDriverApplications(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/drivers/${userId}/applications`, {
    params,
  });
  return res.data.data as PageResult<JobApplication>;
}

/* =============================================================================
 * Invitations
 * =============================================================================
 */

/**
 * List invitations sent to this driver.
 *
 * Backend: GET /api/drivers/{userId}/invitations
 *
 * @param params - { page?, size?, status?, ... }
 * @returns PageResult<Invite>
 */
export async function listDriverInvites(
  userId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/drivers/${userId}/invitations`, { params });
  return res.data.data as PageResult<Invite>;
}

/**
 * Accept an invitation.
 *
 * Backend: POST /api/drivers/{userId}/invitations/{inviteId}/accept
 *
 * @returns Backend-defined payload (e.g., employment object or status)
 */
export async function acceptInvite(userId: string, inviteId: string) {
  const res = await api.post(
    `/api/drivers/${userId}/invitations/${inviteId}/accept`
  );
  // console.log could be noisy in production; keep if you need debugging.
  // console.log("ACCEPT INVITE RES: ", res);
  return res.data.data;
}

/**
 * Reject an invitation.
 *
 * Backend: POST /api/drivers/{userId}/invitations/{inviteId}/reject
 */
export async function rejectInvite(userId: string, inviteId: string) {
  const res = await api.post(
    `/api/drivers/${userId}/invitations/${inviteId}/reject`
  );
  return res.data.data;
}

/* =============================================================================
 * Employment
 * =============================================================================
 */

/**
 * Get driver's employment status.
 *
 * Backend: GET /api/drivers/{userId}/employment
 *
 * @returns { isHired: boolean; companyId?: string }
 */
export async function getEmploymentStatus(userId: string) {
  const res = await api.get(`/api/drivers/${userId}/employment`);
  return res.data.data as { isHired: boolean; companyId?: string };
}

/* =============================================================================
 * Public profile
 * =============================================================================
 */

/**
 * Get driver's public profile (for public view pages).
 *
 * Backend: GET /api/drivers/{userId}/public
 *
 * @returns DriverPublicProfile (includes profile + public stats/aggregates)
 */
export async function getDriverPublicProfile(userId: string) {
  const res = await api.get(`/api/drivers/${userId}/public`);
  return res.data.data as DriverPublicProfile;
}
