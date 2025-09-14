// src/api/admin.ts
import api from "./axios";
import type { PageResult } from "./types";

export type AdminMetrics = {
  totalUsers: number; riders: number; drivers: number;
  companies: number; activeCompanies: number;
  transactionsCount: number;
  membershipRevenueCents: number;
  orderGmvCents: number;
  salaryPaidCents: number;
  topupsCents: number;
  withdrawalsCents: number;
};

export type AdminTimeseries = {
  from: string; to: string;
  dates: string[];
  newUsers: number[];
  completedOrders: number[];
  orderGmvCents: number[];
  membershipRevenueCents: number[];
};

export type TopCompany = { id: string; name: string; rating: number; revenueCents: number; };
export type TopDriver  = { userId: string; fullName: string; rating: number; salaryCents: number; };

export type AdminUserListItem = {
  id: string; email: string; role: string; isActive: boolean; createdAt: string;
};

// Metrics
export async function getAdminMetrics(params: { from?: string; to?: string } = {}) {
  const res = await api.get("/api/admin/metrics", { params });
  return res.data.data as AdminMetrics;
}
export async function getAdminTimeseries(params: { from?: string; to?: string } = {}) {
  const res = await api.get("/api/admin/metrics/timeseries", { params });
  return res.data.data as AdminTimeseries;
}

// Top
export async function getTopCompanies(limit = 5) {
  const res = await api.get("/api/admin/top/companies", { params: { limit } });
  return res.data.data as TopCompany[];
}
export async function getTopDrivers(limit = 5) {
  const res = await api.get("/api/admin/top/drivers", { params: { limit } });
  return res.data.data as TopDriver[];
}

// Users
export async function listUsers(params: { page?: number; size?: number; role?: string; search?: string } = {}) {
  const res = await api.get("/api/admin/users", { params });
  return res.data.data as PageResult<AdminUserListItem>;
}
export async function deactivateUser(
  userId: string,
  payload: { reasonCode: string; reasonNote?: string; expiresAt?: string }
) {
  const res = await api.post(`/api/admin/users/${userId}/deactivate`, payload);
  return res.data.data as { id: string; isActive: boolean; reasonCode: string };
}
export async function reactivateUser(
  userId: string,
  payload: { reasonCode?: string } = { reasonCode: "manual" }
) {
  const res = await api.post(`/api/admin/users/${userId}/reactivate`, payload);
  return res.data.data as { id: string; isActive: boolean; reasonCode?: string };
}
