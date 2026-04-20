import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../api/health'

export function useHealth(opts?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: opts?.refetchInterval ?? 30_000,
    staleTime: 5_000,
  })
}
