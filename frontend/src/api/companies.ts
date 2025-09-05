import api from "./axios";
import type {
    Company,
    PageResult,
    Service,
    Wallet,
    Transaction,
    Invite,
    JobApplication,
} from "./types";

/** Dịch vụ public (map với PublicServiceDto của BE) */
export type PublicService = {
    id: string;
    companyId: string;
    title: string;
    description?: string | null;
    priceCents: number;
    updatedAt: string;
    companyName: string;
    companyImgUrl?: string | null;
  };
/** Unwrap chuẩn ApiResponse<T> (theo interceptor current) */
function pickData<T>(res: any): T {
    const body = res?.data;
    if (body && typeof body === "object" && "success" in body) {
      return (body as { success: boolean; data: T }).data as T;
    }
    return body as T;
  }

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

// export async function listCompanies(params: Record<string, any> = {}) {
//     const res = await api.get("/api/companies", { params });
//     return res.data.data as PageResult<Company>;
// }
export async function listCompanies(params: {
    name?: string;
    membership?: string;
    isActive?: boolean;
    minRating?: number;
    maxRating?: number;
    page?: number;
    size?: number;
    sort?: string; // "rating:desc" | "name:asc" ...
  } = {}): Promise<PageResult<Company>> {
    const res = await api.get("/api/companies", { params });
    // interceptor giữ nguyên body {success,data,error}
    const body = res.data as ApiResponse<PageResult<Company>>;
    return (body?.data as PageResult<Company>) ?? {
      page: 1, size: 0, totalItems: 0, totalPages: 0,
      hasNext: false, hasPrev: false, items: []
    };
  }


export async function getCompanyById(id: string) {
    const res = await api.get(`/api/companies/${id}`);
    return res.data.data as Company;
}

export async function getMyCompany() {
    const res = await api.get("/api/companies/me");
    return res.data.data as Company;
}

export async function updateMyCompany(payload: Partial<Company>) {
    const res = await api.put("/api/companies/me", payload);
    return res.data.data as Company;
}

export async function listCompanyDrivers(
    companyId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/companies/${companyId}/drivers`, {
        params,
    });
    return res.data.data;
}

export async function listTransactions(
    companyId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/companies/${companyId}/transactions`, {
        params,
    });
    return res.data.data as PageResult<Transaction>;
}

export async function paySalary(
    companyId: string,
    payload: {
        driverUserId: string;
        amountCents: number;
        idempotencyKey?: string;
    }
) {
    const res = await api.post(
        `/api/companies/${companyId}/pay-salary`,
        payload
    );
    return res.data.data;
}

export async function listApplications(
    companyId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/companies/${companyId}/applications`, {
        params,
    });
    return res.data.data as PageResult<JobApplication>;
}

export async function approveApplication(companyId: string, appId: string) {
    const res = await api.post(
        `/api/companies/${companyId}/applications/${appId}/approve`
    );
    return res.data.data;
}

export async function rejectApplication(companyId: string, appId: string) {
    const res = await api.post(
        `/api/companies/${companyId}/applications/${appId}/reject`
    );
    return res.data.data;
}

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

export async function cancelInvitation(companyId: string, inviteId: string) {
    const res = await api.post(
        `/api/companies/${companyId}/invitations/${inviteId}/cancel`
    );
    return res.data.data;
}

export async function listInvitations(
    companyId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/companies/${companyId}/invitations`, {
        params,
    });
    return res.data.data as PageResult<Invite>;
}

export async function confirmOrder(orderId: string) {
    const res = await api.post(`/api/companies/orders/${orderId}/confirm`);
    return res.data.data;
}

export async function completeOrder(orderId: string) {
    const res = await api.post(`/api/companies/orders/${orderId}/complete`);
    return res.data.data;
}

// COMPANY WALLET
export async function getCompanyWallet(companyId: string): Promise<Wallet> {
    const res = await api.get(`/api/companies/${companyId}/wallet`);
    return res.data.data as Wallet;
}

export async function topupCompanyWallet(
    companyId: string,
    payload: { amountCents: number; idempotencyKey?: string }
) {
    const res = await api.post(
        `/api/companies/${companyId}/wallet/topup`,
        payload
    );
    return res.data.data; // có thể trả wallet hoặc receipt tuỳ backend
}

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

export async function addCompanyService(
    companyId: string,
    payload: {
        title: string;
        description?: string;
        priceCents: number;
        isActive?: boolean;
    }
) {
    const res = await api.post(`/api/companies/${companyId}/services`, payload);
    return res.data.data as Service;
}
// Services
export async function listCompanyServices(
    companyId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/companies/${companyId}/services`, {
        params,
    });
    return res.data.data as PageResult<Service>;
}

export async function listCompanyServicesPublic(
    companyId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/companies/${companyId}/services/public`, {
        params,
    });
    return res.data.data as PageResult<Service>;
}

export async function createCompanyService(
    companyId: string,
    payload: {
        title: string;
        description?: string;
        priceCents: number;
        isActive?: boolean;
    }
) {
    const res = await api.post(`/api/companies/${companyId}/services`, payload);
    return res.data.data as Service;
}

export async function updateCompanyService(
    companyId: string,
    serviceId: string,
    payload: Partial<
        Pick<Service, "title" | "description" | "priceCents" | "isActive">
    >
) {
    const res = await api.put(
        `/api/companies/${companyId}/services/${serviceId}`,
        payload
    );
    return res.data.data as Service;
}

// Gọi endpoint đúng thay vì PUT isActive
export async function pauseCompanyService(
    companyId: string,
    serviceId: string
) {
    const res = await api.post(
        `/api/companies/${companyId}/services/${serviceId}/pause`
    );
    return res.data.data as Service;
}

export async function reactivateCompanyService(
    companyId: string,
    serviceId: string
) {
    const res = await api.post(
        `/api/companies/${companyId}/services/${serviceId}/reactivate`
    );
    return res.data.data as Service;
}

export async function payMembership(
    companyId: string,
    payload: { plan: string; amountCents: number; idempotencyKey?: string }
) {
    const res = await api.post(
        `/api/companies/${companyId}/pay-membership`,
        payload
    );
    return res.data.data; // { membership, expiresAt, balance }
}
/** Public: dịch vụ mới nhất */
export async function getLatestServices(params: { size?: number } = {}) {
  const res = await api.get("/api/companies/services/latest", {
    params: { page: 1, size: params.size ?? 6 },
  });
  return pickData<PageResult<PublicService>>(res);
}
