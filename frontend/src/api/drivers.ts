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

/* Profile (me) */
export async function getMyDriverProfile() {
    const res = await api.get("/api/drivers/me");
    return res.data.data as DriverProfile;
}

export async function updateMyDriverProfile(payload: Partial<DriverProfile>) {
    const res = await api.put("/api/drivers/me", payload);
    return res.data.data as DriverProfile;
}

/* Public / by id */
export async function listDrivers(params: Record<string, any> = {}) {
    const res = await api.get("/api/drivers", { params });
    return res.data.data as PageResult<DriverProfile>;
}

export async function getDriverProfile(userId: string) {
    const res = await api.get(`/api/drivers/${userId}`);
    return res.data.data as DriverProfile;
}

/* Availability */
export async function updateDriverAvailability(
    userId: string,
    isAvailable: boolean
) {
    const res = await api.post(`/api/drivers/${userId}/availability`, {
        isAvailable,
    });
    return res.data.data as DriverProfile;
}

/* Wallet & Transactions */
export async function getDriverWallet(userId: string) {
    const res = await api.get(`/api/drivers/${userId}/wallet`);
    return res.data.data as Wallet;
}

export async function topupDriverWallet(
    userId: string,
    payload: { amountCents: number; idempotencyKey?: string }
) {
    const res = await api.post(`/api/drivers/${userId}/wallet/topup`, payload);
    return res.data.data;
}

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

export async function listDriverTransactions(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/drivers/${userId}/transactions`, {
        params,
    });
    return res.data.data as PageResult<Transaction>;
}

/* Companies & Applications (perspective: driver) */
export async function listCompaniesForDriver(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/drivers/${userId}/companies`, { params });
    return res.data.data as PageResult<Company>;
}

export async function applyToCompanyAsDriver(
    userId: string,
    payload: { companyId: string; expiresAt?: string }
) {
    const res = await api.post(`/api/drivers/${userId}/applications`, payload);
    return res.data.data as JobApplication;
}

export async function cancelApplication(userId: string, applicationId: string) {
    const res = await api.delete(
        `/api/drivers/${userId}/applications/${applicationId}`
    );
    return res.data.data;
}

export async function listDriverApplications(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/drivers/${userId}/applications`, {
        params,
    });
    return res.data.data as PageResult<JobApplication>;
}

/* Invitations */
export async function listDriverInvites(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/drivers/${userId}/invitations`, { params });
    return res.data.data as PageResult<Invite>;
}

export async function acceptInvite(userId: string, inviteId: string) {
    const res = await api.post(
        `/api/drivers/${userId}/invitations/${inviteId}/accept`
    );
    console.log("ACCEPT INVITE RES: ", res);
    return res.data.data;
}

export async function rejectInvite(userId: string, inviteId: string) {
    const res = await api.post(
        `/api/drivers/${userId}/invitations/${inviteId}/reject`
    );
    return res.data.data;
}

export async function getEmploymentStatus(userId: string) {
    const res = await api.get(`/api/drivers/${userId}/employment`);
    return res.data.data as { isHired: boolean; companyId?: string };
}

export async function getDriverPublicProfile(userId: string) {
    const res = await api.get(`/api/drivers/${userId}/public`);
    return res.data.data as DriverPublicProfile;
}
