import type { Anomaly } from '../../api/types'
import { StatusBadge } from '../ui/StatusBadge'
import { ScoreBar } from '../ui/ScoreBar'
import { formatINR, fmtDateTime, truncate } from '../../lib/utils'
import { Building2, IndianRupee, Tag, Calendar } from 'lucide-react'

interface Props {
  anomaly: Anomaly
}

export function AnomalyCard({ anomaly: a }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={a.anomaly_type} />
          <StatusBadge status={a.status} />
        </div>
        <span className="text-[10px] text-gray-600 shrink-0 flex items-center gap-1 mt-0.5">
          <Calendar className="w-3 h-3" />
          {fmtDateTime(a.detected_at).slice(0, 10)}
        </span>
      </div>

      {(a.vendor || a.amount != null || a.department) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {a.vendor && (
            <span className="flex items-center gap-1 text-gray-300">
              <Building2 className="w-3 h-3 text-gray-500 shrink-0" />{a.vendor}
            </span>
          )}
          {a.amount != null && (
            <span className="flex items-center gap-1 text-gray-300 font-medium">
              <IndianRupee className="w-3 h-3 text-gray-500 shrink-0" />{formatINR(a.amount)}
            </span>
          )}
          {a.department && (
            <span className="flex items-center gap-1 text-gray-500">
              <Tag className="w-3 h-3 shrink-0" />{a.department}
            </span>
          )}
        </div>
      )}

      {a.root_cause && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{a.root_cause}</p>
      )}

      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600 w-7 shrink-0 text-[10px]">APS</span>
        <ScoreBar score={a.aps_score} className="flex-1" />
      </div>

      {a.suggested_action && (
        <p className="text-[11px] text-cs-blue bg-cs-blue/5 border border-cs-blue/15 rounded-lg px-2.5 py-1.5 leading-snug">
          {truncate(a.suggested_action, 120)}
        </p>
      )}
    </div>
  )
}
