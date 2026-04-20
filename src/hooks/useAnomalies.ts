import { useQuery } from '@tanstack/react-query'
import { getAnomalies } from '../api/anomalies'

interface Params {
  status?: string
  process_id?: string
  limit?: number
  refetchInterval?: number | false
}

export function useAnomalies(params: Params = {}) {
  const { refetchInterval, ...queryParams } = params
  return useQuery({
    queryKey: ['anomalies', queryParams],
    queryFn: () => getAnomalies(queryParams),
    refetchInterval: refetchInterval ?? false,
    staleTime: 10_000,
  })
}
