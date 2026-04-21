import type { ProcessSummary } from '../../api/types'
import { fmtDateTime } from '../../lib/utils'

interface Props {
  processes: ProcessSummary[]
  selectedId: string | undefined
  onSelect: (id: string | undefined) => void
}

export function ProcessSelector({ processes, selectedId, onSelect }: Props) {
  return (
    <select
      className="bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cs-blue"
      value={selectedId ?? ''}
      onChange={e => onSelect(e.target.value || undefined)}
    >
      <option value="">All processes</option>
      {processes.map(p => (
        <option key={p.process_id} value={p.process_id}>
          {fmtDateTime(p.started_at).slice(0, 16)} — {p.anomaly_count} anomalies
        </option>
      ))}
    </select>
  )
}
