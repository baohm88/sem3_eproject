import api from './axios';
import type { Company, PageResult, Service, Wallet, Transaction, Invite, JobApplication } from './types';

export async function listCompanies(params: Record<string, any> = {}) {
  const res = await api.get('/api/companies', { params });
  return res.data.data as PageResult<Company>;
}

export async function getCompany(id: string) {
  const res = await api.get(`/api/companies/${id}`);
  return res.data.data as Company;
}

export async function getMyCompany() {
  const res = await api.get('/api/companies/me');
  return res.data.data as Company;
}

export async function updateMyCompany(payload: Partial<Company>) {
  const res = await api.put('/api/companies/me', payload);
  return res.data.data as Company;
}

export async function listCompanyDrivers(companyId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/companies/${companyId}/drivers`, { params });
  return res.data.data;
}

export async function addService(companyId: string, payload: { title: string; description?: string; priceCents: number; isActive?: boolean }) {
  const res = await api.post(`/api/companies/${companyId}/services`, payload);
  return res.data.data as Service;
}

export async function getWallet(companyId: string) {
  const res = await api.get(`/api/companies/${companyId}/wallet`);
  return res.data.data as Wallet;
}

export async function listTransactions(companyId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/companies/${companyId}/transactions`, { params });
  return res.data.data as PageResult<Transaction>;
}

export async function topup(companyId: string, payload: { amountCents: number; idempotencyKey?: string }) {
  const res = await api.post(`/api/companies/${companyId}/wallet/topup`, payload);
  return res.data.data;
}

export async function paySalary(companyId: string, payload: { driverUserId: string; amountCents: number; idempotencyKey?: string }) {
  const res = await api.post(`/api/companies/${companyId}/pay-salary`, payload);
  return res.data.data;
}

export async function payMembership(companyId: string, payload: { plan: string; amountCents: number; idempotencyKey?: string }) {
  const res = await api.post(`/api/companies/${companyId}/pay-membership`, payload);
  return res.data.data;
}

export async function listApplications(companyId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/companies/${companyId}/applications`, { params });
  return res.data.data as PageResult<JobApplication>;
}

export async function approveApplication(companyId: string, appId: string) {
  const res = await api.post(`/api/companies/${companyId}/applications/${appId}/approve`);
  return res.data.data;
}

export async function rejectApplication(companyId: string, appId: string) {
  const res = await api.post(`/api/companies/${companyId}/applications/${appId}/reject`);
  return res.data.data;
}

export async function inviteDriver(companyId: string, payload: { driverUserId: string; baseSalaryCents: number; expiresAt?: string }) {
  const res = await api.post(`/api/companies/${companyId}/invitations`, payload);
  return res.data.data as Invite;
}

export async function listInvitations(companyId: string, params: Record<string, any> = {}) {
  const res = await api.get(`/api/companies/${companyId}/invitations`, { params });
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
