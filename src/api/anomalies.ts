import { api } from './axios'
import type {
  AnomalyListResponse,
  PendingApprovalResponse,
  ApproveAnomalyIn,
  ApproveAnomalyOut,
  RejectAnomalyIn,
  RejectAnomalyOut,
  AssignAnomalyIn,
  AssignAnomalyOut,
  BulkApproveIn,
  BulkApproveOut,
  BulkRejectIn,
  BulkRejectOut,
} from './types'

export const getAnomalies = (params?: {
  status?: string
  process_id?: string
  assigned_to?: string
  limit?: number
}) => api.get<AnomalyListResponse>('/anomalies', { params }).then((r) => r.data)

export const getPendingApproval = (params?: { assigned_to?: string }) =>
  api.get<PendingApprovalResponse>('/anomalies/pending-approval', { params }).then((r) => r.data)

export const approveAnomaly = (id: string, body: ApproveAnomalyIn) =>
  api.post<ApproveAnomalyOut>(`/anomalies/${id}/approve`, body).then((r) => r.data)

export const rejectAnomaly = (id: string, body: RejectAnomalyIn) =>
  api.post<RejectAnomalyOut>(`/anomalies/${id}/reject`, body).then((r) => r.data)

export const assignAnomaly = (id: string, body: AssignAnomalyIn) =>
  api.patch<AssignAnomalyOut>(`/anomalies/${id}/assign`, body).then((r) => r.data)

export const bulkApprove = (body: BulkApproveIn) =>
  api.post<BulkApproveOut>('/anomalies/bulk-approve', body).then((r) => r.data)

export const bulkReject = (body: BulkRejectIn) =>
  api.post<BulkRejectOut>('/anomalies/bulk-reject', body).then((r) => r.data)
