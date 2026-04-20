import { useQuery } from '@tanstack/react-query'
import { getProcesses } from '../api/logs'

export function useProcesses(limit = 50) {
  return useQuery({
    queryKey: ['processes', limit],
    queryFn: () => getProcesses(limit),
    staleTime: 15_000,
  })
}
