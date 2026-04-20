import { api } from './axios'
import type { ProcessListResponse, ProcessLogResponse } from './types'

export const getProcesses = (limit = 50) =>
  api.get<ProcessListResponse>('/logs/processes', { params: { limit } }).then((r) => r.data)

export const getProcessTrace = (processId: string) =>
  api.get<ProcessLogResponse>(`/logs/${processId}`).then((r) => r.data)

export const getLogs = (params?: {
  process_id?: string
  agent_name?: string
  limit?: number
}) => api.get<ProcessLogResponse>('/logs', { params }).then((r) => r.data)
