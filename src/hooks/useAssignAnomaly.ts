import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignAnomaly } from '../api/anomalies'

export function useAssignAnomaly() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, assigned_to }: { id: string; assigned_to: string }) =>
      assignAnomaly(id, { assigned_to }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['anomalies'] })
      qc.invalidateQueries({ queryKey: ['pending-approval'] })
    },
  })
}
