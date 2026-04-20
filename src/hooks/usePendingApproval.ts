import { useQuery } from '@tanstack/react-query'
import { getPendingApproval } from '../api/anomalies'

export function usePendingApproval(params?: { assigned_to?: string }) {
  return useQuery({
    queryKey: ['pending-approval', params],
    queryFn: () => getPendingApproval(params),
    refetchInterval: 30_000,
    staleTime: 10_000,
  })
}
