// ── Anomaly ─────────────────────────────────────────────────────
export type AnomalyStatus =
  | 'detected'
  | 'pending_approval'
  | 'approved'
  | 'auto_executed'
  | 'rejected'

export type AnomalyType =
  | 'duplicate_payment'
  | 'cloud_waste'
  | 'unused_saas'
  | 'vendor_rate_anomaly'
  | 'sla_penalty_risk'

export interface Anomaly {
  anomaly_id: string
  record_id: string | null
  process_id: string
  anomaly_type: AnomalyType | string
  isolation_score: number | null
  rule_flags: string[]
  root_cause: string | null
  confidence: number | null
  suggested_action: string | null
  model_used: string | null
  as_score: number | null
  aps_score: number | null
  financial_impact: number | null
  frequency_rank: number | null
  recoverability_ease: number | null
  severity_risk: number | null
  complexity: number | null
  approval_needed: boolean
  status: AnomalyStatus
  approved_by: string | null
  approved_at: string | null
  approval_notes: string | null
  assigned_to: string | null
  rejected_by: string | null
  rejection_reason: string | null
  rejected_at: string | null
  detected_at: string
  updated_at: string
  vendor: string | null
  amount: number | null
  currency: string | null
  department: string | null
  category: string | null
  transaction_date: string | null
}

export interface AnomalyListResponse {
  count: number
  total_exposure_inr: number
  total_recovered_inr: number
  anomalies: Anomaly[]
}

export interface PendingApprovalResponse {
  pending: Anomaly[]
  count: number
}

export interface ApproveAnomalyIn {
  approved_by: string
  notes?: string
}

export interface ApproveAnomalyOut {
  message: string
  anomaly: Anomaly
}

export interface RejectAnomalyIn {
  rejected_by: string
  reason?: string
}

export interface RejectAnomalyOut {
  message: string
  anomaly: Anomaly
}

export interface AssignAnomalyIn {
  assigned_to: string
}

export interface AssignAnomalyOut {
  message: string
  anomaly: Anomaly
}

export interface BulkApproveIn {
  anomaly_ids: string[]
  approved_by: string
  notes?: string
}

export interface BulkApproveOut {
  approved: number
  skipped: number
  message: string
}

export interface BulkRejectIn {
  anomaly_ids: string[]
  rejected_by: string
  reason?: string
}

export interface BulkRejectOut {
  rejected: number
  skipped: number
  message: string
}

// ── Ingest ───────────────────────────────────────────────────────
export interface SpendRecordIn {
  vendor: string
  amount: number
  currency: string
  department: string
  category: string
  transaction_date: string
  source?: string
  invoice_number?: string
  description?: string
}

export interface IngestDemoIn {
  n: number
  seed: number
  include_anomalies: boolean
}

export interface IngestDemoOut {
  message: string
  process_id: string
  records: number
}

export interface IngestBatchOut {
  message: string
  process_id: string
  records_submitted: number
  records_skipped: number
}

// ── Summary ──────────────────────────────────────────────────────
export interface AgentStat {
  agent_name: string
  events_processed: number
  errors: number
  avg_duration_ms: number
  last_seen: string | null
}

export interface CFOSummary {
  anomalies_detected: number
  resolved: number
  open: number
  pending_approval: number
  total_exposure_inr: number
  total_recovered_inr: number
  pending_exposure_inr: number
  recovery_rate_pct: number
  top_anomaly: Anomaly | null
  events_by_topic: Record<string, number>
  agents_active: number
  anomaly_breakdown: Record<string, number>
  status_distribution: Record<string, number>
  agent_stats: AgentStat[]
  source_stats: Record<string, number>
}

// ── Logs ─────────────────────────────────────────────────────────
export type LogStatus = 'success' | 'error' | 'skipped'

export interface ProcessLog {
  log_id: number
  process_id: string
  agent_name: string
  event_id: string | null
  topic_in: string | null
  topic_out: string | null
  record_id: string | null
  anomaly_id: string | null
  input_payload: Record<string, unknown>
  output_payload: Record<string, unknown> | null
  status: LogStatus
  error_message: string | null
  started_at: string
  completed_at: string | null
  duration_ms: number | null
}

export interface ProcessLogResponse {
  count: number
  logs: ProcessLog[]
}

export interface ProcessSummary {
  process_id: string
  started_at: string
  record_count: number
  anomaly_count: number
  agent_count: number
  has_errors: boolean
}

export interface ProcessListResponse {
  count: number
  processes: ProcessSummary[]
}

// ── Health ────────────────────────────────────────────────────────
export interface HealthOut {
  status: string
  version: string
  environment: string
  events_processed: number
  topics: Record<string, number>
  agents_registered: number
}

// ── Synthetic ─────────────────────────────────────────────────────
export interface SyntheticDataResponse {
  count: number
  seed: number
  include_anomalies: boolean
  records: Record<string, unknown>[]
}

// ── Bus Events ────────────────────────────────────────────────────
export interface BusEvent {
  event_id: string
  topic: string
  source_agent: string
  process_id: string
  payload: Record<string, unknown>
  timestamp: string
}

export interface BusEventsResponse {
  count: number
  events: BusEvent[]
}

// ── Audit ─────────────────────────────────────────────────────────
export interface AuditEntry {
  log_id: number
  event_id: string
  topic: string
  source_agent: string
  process_id: string | null
  anomaly_id: string | null
  record_id: string | null
  payload_summary: Record<string, unknown>
  logged_at: string
}

export interface AuditLogResponse {
  count: number
  log: AuditEntry[]
}

// ── UI-only ───────────────────────────────────────────────────────
export type AgentStatus = 'healthy' | 'warning' | 'error' | 'idle'

export interface AgentNodeConfig {
  id: string
  label: string
  agentName: string
  x: number
  y: number
}
