export type Role = "Admin" | "Company" | "Driver" | "Rider";

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: { code: string; message: string; details?: any };
};

export type Profile = { id: string; email: string; role: Role };

export type PageResult<T> = {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    items: T[];
};

export type Company = {
    id: string;
    ownerUserId: string;
    name: string;
    description?: string;
    imgUrl?: string;
    rating?: number;
    membership: string;
    membershipExpiresAt?: string;
    isActive: boolean;
};

export type DriverProfile = {
    id: string;
    userId: string;
    fullName: string;
    phone?: string;
    bio?: string;
    rating: number;
    skills?: string;
    location?: string;
    isAvailable: boolean;
    imgUrl?: string;
};

export type RiderProfile = {
    id: string;
    userId: string;
    fullName: string;
    phone?: string;
    imgUrl?: string;
};

export type Service = {
    id: string;
    companyId: string;
    title: string;
    imgUrl: string | null;
    description?: string;
    priceCents: number;
    isActive: boolean;
};

export type Wallet = {
    id: string;
    ownerType: string;
    ownerRefId: string;
    balanceCents: number;
    lowBalanceThreshold: number;
    updatedAt: string;
};

export type Transaction = {
    id: string;
    fromWalletId?: string;
    toWalletId?: string;
    amountCents: number;
    status: "Pending" | "Completed" | "Failed";
    idempotencyKey?: string;
    createdAt: string;
};

export type Order = {
    id: string;
    riderUserId: string;
    companyId: string;
    serviceId: string;
    status: "Pending" | "InProgress" | "Completed" | "Cancelled";
    priceCents: number;
    createdAt: string;
    updatedAt: string;
};

export type Invite = {
    id: string;
    companyId: string;
    driverUserId: string;
    baseSalaryCents: number;
    status: string;
    createdAt: string;
    expiresAt?: string;
};

export type JobApplication = {
    id: string;
    companyId: string;
    driverUserId: string;
    status: "Applied" | "Accepted" | "Rejected" | "Expired";
    createdAt: string;
    expiresAt?: string;
};

export type Employment = {
    companyId: string;
    companyName: string;
    companyImgUrl?: string | null;
    since: string;
    baseSalaryCents: number;
};

export type DriverPublicProfile = {
    driver: {
        id: string;
        userId: string;
        fullName: string;
        phone?: string | null;
        bio?: string | null;
        imgUrl?: string | null;
        rating: number;
        skills?: string | null; // JSON string hoặc CSV
        location?: string | null;
        isAvailable: boolean;
        createdAt: string;
        updatedAt: string;
        isHired?: boolean; // nếu BE đã thêm cột
    } | null;
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
        createdAt: string;
    }>;
};

export type CompanyPublicProfile = {
    company: Company;
    rating: number;
    activeServicesCount: number;
    driversCount: number;
    services: Service[];
};
