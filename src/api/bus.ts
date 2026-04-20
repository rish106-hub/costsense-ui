import { api } from './axios'
import type { BusEventsResponse } from './types'

export const getBusEvents = (params?: { topic?: string; limit?: number }) =>
  api.get<BusEventsResponse>('/bus/events', { params }).then((r) => r.data)
