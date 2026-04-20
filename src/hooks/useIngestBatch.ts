import { useMutation } from '@tanstack/react-query'
import { ingestBatch } from '../api/ingest'

export function useIngestBatch() {
  return useMutation({ mutationFn: ingestBatch })
}
