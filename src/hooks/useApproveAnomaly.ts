import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveAnomaly } from '../api/anomalies'

export function useApproveAnomaly() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, approved_by, notes }: { id: string; approved_by: string; notes?: string }) =>
      approveAnomaly(id, { approved_by, notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['anomalies'] })
      qc.invalidateQueries({ queryKey: ['pending-approval'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
