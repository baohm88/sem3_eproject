import api from './axios';
import type { DriverProfile, PageResult, Wallet, Transaction, Company, Invite, JobApplication } from './types';

export async function getMyDriver() {
  const res = await api.get('/api/drivers/me');
  return res.data.data as DriverProfile;
}

export async function updateMyDriver(payload: Partial<DriverProfile>) {
  const res = await api.put('/api/drivers/me', payload);
  return res.data.data as DriverProfile;
}

export async function listDrivers(params: Record<string, any> = {}) {
  const res = await api.get('/api/drivers', { params });
  return res.data.data as PageResult<DriverProfile>;
}

export async function getDriver(userId: string) {
  const res = await api.get(`/api/drivers/${userId}`);
  return res.data.data as DriverProfile;
}

export async function setAvailability(userId: string, isAvailable: boolean) {
  const res = await api.post(`/api/drivers/${userId}/availability`, { isAvailable });
  return res.data.data as DriverProfile;
}

export async function getWallet(userId: string) {
  const res = await api.get(`/api/drivers/${userId}/wallet`);
  return res.data.data as Wallet;
}

export async function listTransactions(userId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/drivers/${userId}/transactions`, { params });
  return res.data.data as PageResult<Transaction>;
}

export async function withdraw(userId: string, payload: { amountCents: number; idempotencyKey?: string }) {
  const res = await api.post(`/api/drivers/${userId}/wallet/withdraw`, payload);
  return res.data.data;
}

export async function listMyCompanies(userId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/drivers/${userId}/companies`, { params });
  return res.data.data as PageResult<Company>;
}

export async function applyToCompany(userId: string, payload: { companyId: string; expiresAt?: string }) {
  const res = await api.post(`/api/drivers/${userId}/applications`, payload);
  return res.data.data as JobApplication;
}

export async function listMyApplications(userId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/drivers/${userId}/applications`, { params });
  return res.data.data as PageResult<JobApplication>;
}

export async function listMyInvitations(userId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/drivers/${userId}/invitations`, { params });
  return res.data.data as PageResult<Invite>;
}

export async function acceptInvitation(userId: string, inviteId: string) {
  const res = await api.post(`/api/drivers/${userId}/invitations/${inviteId}/accept`);
  return res.data.data;
}

export async function rejectInvitation(userId: string, inviteId: string) {
  const res = await api.post(`/api/drivers/${userId}/invitations/${inviteId}/reject`);
  return res.data.data;
}
