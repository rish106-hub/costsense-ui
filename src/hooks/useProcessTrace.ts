import { useQuery } from '@tanstack/react-query'
import { getProcessTrace } from '../api/logs'

export function useProcessTrace(processId: string | undefined) {
  return useQuery({
    queryKey: ['process-trace', processId],
    queryFn: () => getProcessTrace(processId!),
    enabled: !!processId,
    staleTime: 15_000,
  })
}
