import api from "./axios";
import type {
    RiderProfile,
    PageResult,
    Wallet,
    Transaction,
    Order,
} from "./types";

export async function getMyRider() {
    const res = await api.get("/api/riders/me");
    return res.data.data as RiderProfile;
}

export async function updateMyRider(payload: Partial<RiderProfile>) {
    const res = await api.put("/api/riders/me", payload);
    console.log("update rider: ", res);

    return res.data.data as RiderProfile;
}

export async function listRiders(params: Record<string, any> = {}) {
    const res = await api.get("/api/riders", { params });
    return res.data.data as PageResult<RiderProfile>;
}

export async function getRider(userId: string) {
    const res = await api.get(`/api/riders/${userId}`);
    return res.data.data as RiderProfile;
}

export async function getWallet(userId: string) {
    const res = await api.get(`/api/riders/${userId}/wallet`);
    return res.data.data as Wallet;
}

export async function listTransactions(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/riders/${userId}/transactions`, { params });
    return res.data.data as PageResult<Transaction>;
}

export async function topup(
    userId: string,
    payload: { amountCents: number; idempotencyKey?: string }
) {
    const res = await api.post(`/api/riders/${userId}/wallet/topup`, payload);
    return res.data.data;
}

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

export async function createOrder(
    userId: string,
    payload: { companyId: string; serviceId: string }
) {
    const res = await api.post(`/api/riders/${userId}/orders`, payload);
    return res.data.data as Order;
}

export async function listOrders(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/riders/${userId}/orders`, { params });
    return res.data.data as PageResult<Order>;
}

export async function cancelOrder(userId: string, orderId: string) {
    const res = await api.post(
        `/api/riders/${userId}/orders/${orderId}/cancel`
    );
    return res.data.data as Order;
}

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

export async function listMyReviews(
    userId: string,
    params: Record<string, any> = {}
) {
    const res = await api.get(`/api/riders/${userId}/reviews`, { params });
    return res.data.data as PageResult<Review>;
}
