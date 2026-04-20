import { useQuery } from '@tanstack/react-query'
import { getSyntheticData } from '../api/synthetic'

export function useSyntheticData(
  params: { n: number; seed: number; include_anomalies: boolean },
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['synthetic', params],
    queryFn: () => getSyntheticData(params),
    enabled,
    staleTime: Infinity,
  })
}
