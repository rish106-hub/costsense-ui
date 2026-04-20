import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../api/summary'

export function useSummary(processId?: string, opts?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ['summary', processId],
    queryFn: () => getSummary(processId),
    refetchInterval: opts?.refetchInterval ?? false,
    staleTime: 10_000,
  })
}
