import { api } from './axios'
import type { IngestDemoIn, IngestDemoOut, IngestBatchOut, SpendRecordIn } from './types'

export const ingestDemo = (body: IngestDemoIn) =>
  api.post<IngestDemoOut>('/ingest/demo', body).then((r) => r.data)

export const ingestBatch = (records: SpendRecordIn[]) =>
  api.post<IngestBatchOut>('/ingest/batch', records).then((r) => r.data)
