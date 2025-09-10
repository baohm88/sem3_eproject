// // src/api/types.ts

/**
 * -----------------------------------------------------------------------------
 * Shared API Types
 * -----------------------------------------------------------------------------
 * Conventions:
 *  - All date/time fields are ISO 8601 strings (UTC unless specified).
 *  - Monetary fields named `*Cents` are integers. In some domains (e.g., VND),
 *    the value may already be a whole currency unit even if the field name says
 *    "Cents" (no decimals). Check your backend contract before dividing by 100.
 *  - Paginated endpoints return `PageResult<T>`.
 *  - API responses follow the envelope `{ success, data, error }`.
 * -----------------------------------------------------------------------------
 */

export type Role = "Admin" | "Company" | "Driver" | "Rider";

/** Standard API envelope. */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
};

/** Lightweight authenticated user profile (from auth context/session). */
export type Profile = { id: string; email: string; role: Role };

/**
 * Generic pagination wrapper returned by list endpoints.
 * - `page` is 1-based.
 * - `size` is the requested page size.
 * - `hasNext` / `hasPrev` are convenience flags returned by the backend.
 */
export type PageResult<T> = {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  items: T[];
};

/**
 * Company entity (owner-facing & public-facing).
 */
export type Company = {
  id: string;
  ownerUserId: string;
  name: string;
  description?: string;
  imgUrl?: string;
  rating?: number;                // Aggregated rating (0–5), if available
  membership: string;             // e.g., "Premium" | "Basic" | "Free"
  membershipExpiresAt?: string;   // ISO date string
  isActive: boolean;
};

/**
 * Driver entity (owner-facing & public-facing).
 * `skills` is stored as a JSON string or CSV (see consumer code for parsing).
 */
export type DriverProfile = {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  bio?: string;
  rating: number;         // Aggregated rating (0–5)
  skills?: string;        // JSON string or CSV of skills/tags
  location?: string;
  isAvailable: boolean;
  imgUrl?: string;
};

/**
 * Driver information as seen from a company (employment context).
 */
export type CompanyDriver = {
  userId: string;
  fullName: string;
  phone?: string;
  bio?: string;
  imgUrl?: string;
  rating: number;
  skills?: string;        // JSON string or CSV
  location?: string;
  isAvailable: boolean;
  joinedAt: string;       // ISO date string
  baseSalaryCents: number; // See monetary convention note above
};

/** Rider entity (public/basic). */
export type RiderProfile = {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  imgUrl?: string;
};

/**
 * Service offered by a company.
 * NOTE: `priceCents` may be stored as whole VND (no decimals) despite the name.
 */
export type Service = {
  id: string;
  companyId: string;
  title: string;
  imgUrl: string | null;
  description?: string;
  priceCents: number;
  isActive: boolean;
};

/** Wallet entity (for Company/Driver). */
export type Wallet = {
  id: string;
  ownerType: string;       // "Company" | "Driver" | ...
  ownerRefId: string;      // FK to the owner (e.g., companyId or userId)
  balanceCents: number;
  lowBalanceThreshold: number;
  updatedAt: string;       // ISO date string
};

/**
 * Transaction record between wallets.
 */
export type Transaction = {
  id: string;
  fromWalletId?: string;
  toWalletId?: string;
  amountCents: number;
  status: "Pending" | "Completed" | "Failed";
  idempotencyKey?: string;
  createdAt: string;       // ISO date string
};

/**
 * Order entity (simplified).
 */
export type Order = {
  id: string;
  riderUserId: string;
  companyId: string;
  serviceId: string;
  status: "Pending" | "InProgress" | "Completed" | "Cancelled";
  priceCents: number;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
};

/**
 * Invitation from company to driver.
 */
export type Invite = {
  id: string;
  companyId: string;
  driverUserId: string;
  baseSalaryCents: number;
  status: string;
  createdAt: string;       // ISO date string
  expiresAt?: string;      // ISO date string
};

/**
 * Job application from driver to company.
 */
export type JobApplication = {
  id: string;
  companyId: string;
  driverUserId: string;
  status: "Applied" | "Accepted" | "Rejected" | "Expired";
  createdAt: string;       // ISO date string
  expiresAt?: string;      // ISO date string
};

/**
 * Current or historical employment of a driver at a company.
 */
export type Employment = {
  companyId: string;
  companyName: string;
  companyImgUrl?: string | null;
  since: string;           // ISO date string
  baseSalaryCents: number;
};

/**
 * Review entity (aligns with backend C# model).
 * - Represents a rider's review for an order/company/driver (depending on context).
 * - `rating` is typically 1–5.
 */
export type Review = {
  id: string;
  orderId: string;
  riderUserId: string;
  rating: number;          // 1–5
  comment?: string | null;
  createdAt: string;       // ISO date string
};

/**
 * Public driver profile payload returned by the backend.
 * - `reviews` here is a **public/minimal** view. The backend may omit some
 *   internal fields (e.g., orderId/riderUserId) for privacy. If you need the
 *   full `Review`, use endpoints that explicitly return it.
 */
export type DriverPublicProfile = {
  driver:
    | {
        id: string;
        userId: string;
        fullName: string;
        phone?: string | null;
        bio?: string | null;
        imgUrl?: string | null;
        rating: number;
        skills?: string | null; // JSON string or CSV
        location?: string | null;
        isAvailable: boolean;
        createdAt: string;      // ISO date string
        updatedAt: string;      // ISO date string
        isHired?: boolean;      // optional backend field
      }
    | null;
  hiredCompany?:
    | Company
    | {
        id: string;
        name: string;
        imgUrl?: string | null;
        membership: string;
        rating: number;
      }
    | null;
  employmentHistory: Employment[];
  rating: number;
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;     // ISO date string
  }>; // Public/minimal review shape for UI lists
};

/**
 * Public company profile payload returned by the backend.
 * Note: Some endpoints also include pagination metadata for `services`. If you
 * need that on the client, extend this type accordingly where it's consumed.
 */
export type CompanyPublicProfile = {
  company: Company;
  rating: number;
  activeServicesCount: number;
  driversCount: number;
  services: Service[];
};
