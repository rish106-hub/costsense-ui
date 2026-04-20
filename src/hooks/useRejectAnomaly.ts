import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectAnomaly } from '../api/anomalies'

export function useRejectAnomaly() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rejected_by, reason }: { id: string; rejected_by: string; reason?: string }) =>
      rejectAnomaly(id, { rejected_by, reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['anomalies'] })
      qc.invalidateQueries({ queryKey: ['pending-approval'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
