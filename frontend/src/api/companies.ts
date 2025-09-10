// // src/api/companies.ts
import api from "./axios";
import type {
  Company,
  PageResult,
  Service,
  Wallet,
  Transaction,
  Invite,
  JobApplication,
  CompanyPublicProfile,
  CompanyDriver,
} from "./types";

/**
 * -----------------------------------------------------------------------------
 * Companies API
 * -----------------------------------------------------------------------------
 * Thin wrappers over the backend REST endpoints. All functions:
 *  - Use the shared Axios instance (`api`) with interceptors configured in
 *    `src/api/axios.ts`.
 *  - Return the **unwrapped payload** (i.e., `res.data.data`) according to
 *    our API envelope `{ success, data, error }`.
 *  - Throw `AppError` (from axios interceptor) when the request fails or
 *    when the server responds with `{ success: false, error: ... }`.
 *
 * Types like `PageResult<T>` represent paginated results:
 *   {
 *     items: T[];
 *     page: number;      // 1-based
 *     size: number;
 *     totalPages: number;
 *     totalItems: number;
 *   }
 * -----------------------------------------------------------------------------
 */

/* =============================================================================
 * Transactions (Company)
 * =============================================================================
 */

/**
 * List a company's transactions (simplified shape).
 *
 * Backend route: GET /api/companies/{companyId}/transactions
 *
 * @param companyId - The company ID.
 * @param params    - Optional query params (e.g., { page?: number; size?: number }).
 * @returns         - A minimal shape containing items + basic paging info:
 *                    { items, totalItems, page, size }
 *
 * NOTE:
 * - If you need the full `PageResult<Transaction>` shape (with totalPages, etc.),
 *   prefer `listTransactions` below.
 */
export async function listCompanyTransactions(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/transactions`, {
    params,
  });
  return res.data.data as {
    items: Transaction[];
    totalItems: number;
    page: number;
    size: number;
  };
}

/**
 * List a company's transactions (full PageResult).
 *
 * Backend route: GET /api/companies/{companyId}/transactions
 *
 * @param companyId - The company ID.
 * @param params    - Optional query params (e.g., { page?: number; size?: number }).
 * @returns         - PageResult<Transaction>
 */
export async function listTransactions(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/transactions`, {
    params,
  });
  return res.data.data as PageResult<Transaction>;
}

/* =============================================================================
 * Companies (CRUD, listing, details)
 * =============================================================================
 */

/**
 * List companies with optional filters/sorting/pagination.
 *
 * Backend route: GET /api/companies
 *
 * @param params - Query params:
 *   - page?: number (1-based)
 *   - size?: number
 *   - sort?: string (e.g., "rating:desc", "name:asc")
 *   - name?: string (search by company name)
 *   - membership?: "Premium" | "Basic" | "Free"
 *   - minRating?: number
 *   - isActive?: boolean
 * @returns PageResult<Company>
 */
export async function listCompanies(params: Record<string, any> = {}) {
  const res = await api.get("/api/companies", { params });
  return res.data.data as PageResult<Company>;
}

/**
 * Get company by ID (private/admin scope).
 *
 * Backend route: GET /api/companies/{id}
 */
export async function getCompanyById(id: string) {
  const res = await api.get(`/api/companies/${id}`);
  return res.data.data as Company;
}

/**
 * Get the current user's company (owner scope).
 *
 * Backend route: GET /api/companies/me
 */
export async function getMyCompany() {
  const res = await api.get("/api/companies/me");
  return res.data.data as Company;
}

/**
 * Update the current user's company (owner scope).
 *
 * Backend route: PUT /api/companies/me
 *
 * @param payload - Partial company fields to update.
 */
export async function updateMyCompany(payload: Partial<Company>) {
  const res = await api.put("/api/companies/me", payload);
  return res.data.data as Company;
}

/* =============================================================================
 * Company Drivers / Applications / Invitations
 * =============================================================================
 */

/**
 * List drivers belonging to a company.
 *
 * Backend route: GET /api/companies/{companyId}/drivers
 *
 * @param params - Pagination/filter options: { page?, size?, q?, ... }
 * @returns PageResult<CompanyDriver>
 */
export async function listCompanyDrivers(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/drivers`, {
    params,
  });
  return res.data.data as PageResult<CompanyDriver>;
}

/**
 * List job applications submitted to a company.
 *
 * Backend route: GET /api/companies/{companyId}/applications
 *
 * @param params - Pagination/filter options: { page?, size?, status?, ... }
 * @returns PageResult<JobApplication>
 */
export async function listApplications(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/applications`, {
    params,
  });
  return res.data.data as PageResult<JobApplication>;
}

/**
 * Approve a specific job application.
 *
 * Backend route: POST /api/companies/{companyId}/applications/{appId}/approve
 */
export async function approveApplication(companyId: string, appId: string) {
  const res = await api.post(
    `/api/companies/${companyId}/applications/${appId}/approve`
  );
  return res.data.data;
}

/**
 * Reject a specific job application.
 *
 * Backend route: POST /api/companies/{companyId}/applications/{appId}/reject
 */
export async function rejectApplication(companyId: string, appId: string) {
  const res = await api.post(
    `/api/companies/${companyId}/applications/${appId}/reject`
  );
  return res.data.data;
}

/**
 * Create an invitation for a driver to join the company.
 *
 * Backend route: POST /api/companies/{companyId}/invitations
 *
 * @param payload - { driverUserId, baseSalaryCents, expiresAt? (ISO string) }
 * @returns Invite
 */
export async function inviteDriver(
  companyId: string,
  payload: {
    driverUserId: string;
    baseSalaryCents: number;
    expiresAt?: string;
  }
) {
  const res = await api.post(
    `/api/companies/${companyId}/invitations`,
    payload
  );
  return res.data.data as Invite;
}

/**
 * Cancel an invitation by ID.
 *
 * Backend route: POST /api/companies/{companyId}/invitations/{inviteId}/cancel
 */
export async function cancelInvitation(companyId: string, inviteId: string) {
  const res = await api.post(
    `/api/companies/${companyId}/invitations/${inviteId}/cancel`
  );
  return res.data.data;
}

/**
 * List invitations issued by a company.
 *
 * Backend route: GET /api/companies/{companyId}/invitations
 *
 * @param params - Pagination/filter options: { page?, size?, status?, ... }
 * @returns PageResult<Invite>
 */
export async function listInvitations(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/invitations`, {
    params,
  });
  return res.data.data as PageResult<Invite>;
}

/* =============================================================================
 * Orders (Company actions)
 * =============================================================================
 */

/**
 * Mark an order as confirmed by the company.
 *
 * Backend route: POST /api/companies/orders/{orderId}/confirm
 */
export async function confirmOrder(orderId: string) {
  const res = await api.post(`/api/companies/orders/${orderId}/confirm`);
  return res.data.data;
}

/**
 * Mark an order as completed by the company.
 *
 * Backend route: POST /api/companies/orders/{orderId}/complete
 */
export async function completeOrder(orderId: string) {
  const res = await api.post(`/api/companies/orders/${orderId}/complete`);
  return res.data.data;
}

/* =============================================================================
 * Wallet (Company)
 * =============================================================================
 */

/**
 * Get the company's wallet (balance, thresholds, etc.).
 *
 * Backend route: GET /api/companies/{companyId}/wallet
 */
export async function getCompanyWallet(companyId: string): Promise<Wallet> {
  const res = await api.get(`/api/companies/${companyId}/wallet`);
  return res.data.data as Wallet;
}

/**
 * Top up the company's wallet.
 *
 * Backend route: POST /api/companies/{companyId}/wallet/topup
 *
 * @param payload - { amountCents, idempotencyKey? }
 * @returns       - Backend-defined payload (e.g., updated wallet or receipt)
 *
 * TIP: Provide a stable `idempotencyKey` to avoid duplicate topups on retries.
 */
export async function topupCompanyWallet(
  companyId: string,
  payload: { amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(
    `/api/companies/${companyId}/wallet/topup`,
    payload
  );
  return res.data.data; // may be wallet or a receipt, depending on backend
}

/**
 * Withdraw from the company's wallet.
 *
 * Backend route: POST /api/companies/{companyId}/wallet/withdraw
 *
 * @param payload - { amountCents, idempotencyKey? }
 */
export async function withdrawCompanyWallet(
  companyId: string,
  payload: { amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(
    `/api/companies/${companyId}/wallet/withdraw`,
    payload
  );
  return res.data.data;
}

/* =============================================================================
 * Services (Company)
 * =============================================================================
 */

/**
 * List a company's services (owner/admin scope).
 *
 * Backend route: GET /api/companies/{companyId}/services
 *
 * @param params - Pagination/filter/sort: { page?, size?, sort?, isActive?, q?, ... }
 * @returns PageResult<Service>
 */
export async function listCompanyServices(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/services`, {
    params,
  });
  return res.data.data as PageResult<Service>;
}

/**
 * List a company's public services (public scope).
 *
 * Backend route: GET /api/companies/{companyId}/services/public
 *
 * @param params - Pagination/filter/sort: { page?, size?, sort?, isActive?, q?, ... }
 * @returns PageResult<Service>
 */
export async function listCompanyServicesPublic(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/services/public`, {
    params,
  });
  return res.data.data as PageResult<Service>;
}

/**
 * Create a new service for a company.
 *
 * Backend route: POST /api/companies/{companyId}/services
 *
 * @param payload - { title, imgUrl, description?, priceCents, isActive? }
 * @returns Service
 */
export async function createCompanyService(
  companyId: string,
  payload: {
    title: string;
    imgUrl: string;
    description?: string;
    priceCents: number;
    isActive?: boolean;
  }
) {
  const res = await api.post(`/api/companies/${companyId}/services`, payload);
  return res.data.data as Service;
}

/**
 * Update an existing company service.
 *
 * Backend route: PUT /api/companies/{companyId}/services/{serviceId}
 */
export async function updateCompanyService(
  companyId: string,
  serviceId: string,
  payload: Partial<
    Pick<Service, "title" | "imgUrl" | "description" | "priceCents" | "isActive">
  >
) {
  const res = await api.put(
    `/api/companies/${companyId}/services/${serviceId}`,
    payload
  );
  return res.data.data as Service;
}

/**
 * Pause a service (preferred over directly toggling `isActive` via PUT).
 *
 * Backend route: POST /api/companies/{companyId}/services/{serviceId}/pause
 */
export async function pauseCompanyService(
  companyId: string,
  serviceId: string
) {
  const res = await api.post(
    `/api/companies/${companyId}/services/${serviceId}/pause`
  );
  return res.data.data as Service;
}

/**
 * Reactivate a paused service (preferred over directly toggling `isActive` via PUT).
 *
 * Backend route: POST /api/companies/{companyId}/services/{serviceId}/reactivate
 */
export async function reactivateCompanyService(
  companyId: string,
  serviceId: string
) {
  const res = await api.post(
    `/api/companies/${companyId}/services/${serviceId}/reactivate`
  );
  return res.data.data as Service;
}

/* =============================================================================
 * Payroll / Membership
 * =============================================================================
 */

/**
 * Pay a driver's salary from the company wallet.
 *
 * Backend route: POST /api/companies/{companyId}/pay-salary
 *
 * @param payload - {
 *    driverUserId: string;
 *    amountCents: number;
 *    period?: string;       // YYYY-MM (optional semantic grouping)
 *    note?: string;         // optional note/description
 *    idempotencyKey?: string; // optional; backend should normalize if omitted
 * }
 * @returns {
 *    companyBalance: number;
 *    driverBalance: number;
 *    period: string;        // normalized period
 *    reused?: boolean;      // when idempotency reuses an existing payment
 * }
 */
export async function paySalary(
  companyId: string,
  payload: {
    driverUserId: string;
    amountCents: number;
    period?: string; // "YYYY-MM"
    note?: string;
    idempotencyKey?: string; // optional - backend may normalize if omitted
  }
) {
  const res = await api.post(
    `/api/companies/${companyId}/pay-salary`,
    payload
  );
  return res.data.data as {
    companyBalance: number;
    driverBalance: number;
    period: string;
    reused?: boolean; // idempotency: if already paid this period, backend may return reused=true
  };
}

/**
 * Pay/renew a company's membership plan.
 *
 * Backend route: POST /api/companies/{companyId}/pay-membership
 *
 * @param payload - { plan: string; amountCents: number; idempotencyKey?: string }
 * @returns       - Backend-defined payload (e.g., { membership, expiresAt, balance })
 */
export async function payMembership(
  companyId: string,
  payload: { plan: string; amountCents: number; idempotencyKey?: string }
) {
  const res = await api.post(
    `/api/companies/${companyId}/pay-membership`,
    payload
  );
  return res.data.data; // { membership, expiresAt, balance } depending on backend
}

/* =============================================================================
 * Cross-company / Public aggregates
 * =============================================================================
 */

/**
 * List all services across companies (public aggregate endpoint).
 *
 * Backend route: GET /api/companies/all-services
 *
 * @param params - Pagination/filter/sort.
 * @returns PageResult<Service>
 */
export async function listAllCompaniesServices(
  params: Record<string, any> = {}
) {
  const res = await api.get("/api/companies/all-services", { params });
  return res.data.data as PageResult<Service>;
}

/**
 * Get a company's public profile (for public/company listing page).
 *
 * Backend route: GET /api/companies/{companyId}/public
 *
 * @param params - Pagination/sort for the embedded services list:
 *   - page?: number (1-based), size?: number, sort?: string
 * @returns CompanyPublicProfile
 *
 * Shape example:
 *   {
 *     company: { id, name, description, imgUrl, membership, ... },
 *     rating: number,
 *     activeServicesCount: number,
 *     driversCount: number,
 *     services: Service[],
 *     page: number,
 *     size: number,
 *     totalPages: number,
 *     totalItems: number
 *   }
 */
export async function getCompanyPublicProfile(
  companyId: string,
  params: Record<string, any> = {}
) {
  const res = await api.get(`/api/companies/${companyId}/public`, { params });
  return res.data.data as CompanyPublicProfile;
}
