import { useQuery } from '@tanstack/react-query'
import { getLogs } from '../api/logs'

interface Params {
  process_id?: string
  agent_name?: string
  limit?: number
  refetchInterval?: number | false
}

export function useLogs(params: Params = {}) {
  const { refetchInterval, ...queryParams } = params
  return useQuery({
    queryKey: ['logs', queryParams],
    queryFn: () => getLogs(queryParams),
    refetchInterval: refetchInterval ?? false,
    staleTime: 10_000,
  })
}
