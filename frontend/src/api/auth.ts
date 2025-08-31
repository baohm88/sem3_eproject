import api from "./axios";
import type { Profile } from "./types";

export type LoginPayload = { email: string; password: string };

export async function loginAsync(credentials: LoginPayload) {
    const res = await api.post("/api/auth/login", credentials);
    return res.data.data;
}

export async function registerAsync(payload: {
    email: string;
    password: string;
    role: string;
}) {
    const res = await api.post("/api/auth/register", payload);
    return res.data.data;
}

export async function verifyOtpAsync(payload: { email: string; otp: string }) {
    const res = await api.post("/api/auth/verify-otp", payload);
    return res.data.data;
}

export async function getMyProfileAsync() {
    const res = await api.get("/api/auth/me");
    return res.data.data as Profile;
}

export async function updateAccountAsync(payload: Record<string, unknown>) {
    const res = await api.put("/api/account", payload);
    return res.data.data;
}

export function logout() {
    localStorage.removeItem("token");
}
