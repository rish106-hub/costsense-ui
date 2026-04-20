import { api } from './axios'
import type { CFOSummary } from './types'

export const getSummary = (processId?: string) =>
  api
    .get<CFOSummary>('/summary', { params: processId ? { process_id: processId } : undefined })
    .then((r) => r.data)
