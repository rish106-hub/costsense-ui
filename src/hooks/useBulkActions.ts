import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkApprove, bulkReject } from '../api/anomalies'

export function useBulkApprove() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bulkApprove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['anomalies'] })
      qc.invalidateQueries({ queryKey: ['pending-approval'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}

export function useBulkReject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bulkReject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['anomalies'] })
      qc.invalidateQueries({ queryKey: ['pending-approval'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
    },
  })
}
