import { api } from './axios'
import type { SyntheticDataResponse } from './types'

export const getSyntheticData = (params: {
  n: number
  seed: number
  include_anomalies: boolean
}) => api.get<SyntheticDataResponse>('/synthetic/data', { params }).then((r) => r.data)
