import { api } from './axios'
import type { HealthOut } from './types'

export const getHealth = () => api.get<HealthOut>('/health').then((r) => r.data)
