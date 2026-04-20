import { cn } from '../../lib/utils'
import type { AnomalyStatus, AnomalyType, LogStatus, AgentStatus } from '../../api/types'

type BadgeVariant = AnomalyStatus | AnomalyType | LogStatus | AgentStatus | string

const colorMap: Record<string, string> = {
  detected: 'bg-cs-blue/20 text-cs-blue border-cs-blue/30',
  pending_approval: 'bg-cs-orange/20 text-cs-orange border-cs-orange/30',
  approved: 'bg-cs-green/20 text-cs-green border-cs-green/30',
  auto_executed: 'bg-cs-purple/20 text-cs-purple border-cs-purple/30',
  rejected: 'bg-cs-red/20 text-cs-red border-cs-red/30',
  healthy: 'bg-cs-green/20 text-cs-green border-cs-green/30',
  warning: 'bg-cs-orange/20 text-cs-orange border-cs-orange/30',
  error: 'bg-cs-red/20 text-cs-red border-cs-red/30',
  idle: 'bg-gray-700/40 text-gray-400 border-gray-600/30',
  success: 'bg-cs-green/20 text-cs-green border-cs-green/30',
  skipped: 'bg-gray-700/40 text-gray-400 border-gray-600/30',
  duplicate_payment: 'bg-cs-red/20 text-cs-red border-cs-red/30',
  cloud_waste: 'bg-cs-orange/20 text-cs-orange border-cs-orange/30',
  unused_saas: 'bg-cs-purple/20 text-cs-purple border-cs-purple/30',
  vendor_rate_anomaly: 'bg-cs-blue/20 text-cs-blue border-cs-blue/30',
  sla_penalty_risk: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

const labelMap: Record<string, string> = {
  pending_approval: 'Pending',
  auto_executed: 'Auto-exec',
  duplicate_payment: 'Duplicate',
  cloud_waste: 'Cloud Waste',
  unused_saas: 'Unused SaaS',
  vendor_rate_anomaly: 'Rate Anomaly',
  sla_penalty_risk: 'SLA Risk',
}

interface Props {
  status: BadgeVariant
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  const color = colorMap[status] ?? 'bg-gray-700/40 text-gray-400 border-gray-600/30'
  const label = labelMap[status] ?? status.replace(/_/g, ' ')
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium capitalize', color, className)}>
      {label}
    </span>
  )
}
