import { useQuery } from '@tanstack/react-query'
import { getBusEvents } from '../api/bus'

export function useBusEvents(opts: { limit?: number; refetchInterval?: number | false } = {}) {
  return useQuery({
    queryKey: ['bus-events', opts.limit],
    queryFn: () => getBusEvents({ limit: opts.limit ?? 100 }),
    refetchInterval: opts.refetchInterval ?? false,
    staleTime: 5_000,
  })
}
