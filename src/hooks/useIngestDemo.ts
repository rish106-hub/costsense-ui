import { useMutation } from '@tanstack/react-query'
import { ingestDemo } from '../api/ingest'

export function useIngestDemo() {
  return useMutation({ mutationFn: ingestDemo })
}
