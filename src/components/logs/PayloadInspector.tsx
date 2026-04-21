import { X } from 'lucide-react'
import type { ProcessLog } from '../../api/types'
import { StatusBadge } from '../ui/StatusBadge'
import { fmtAgent, fmtDateTime } from '../../lib/utils'

interface Props {
  log: ProcessLog
  onClose: () => void
}

export function PayloadInspector({ log, onClose }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white">{fmtAgent(log.agent_name)}</span>
          <StatusBadge status={log.status} />
          <span className="text-[10px] text-gray-600">{fmtDateTime(log.started_at)}</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border">
        <PayloadPanel label="Input" data={log.input_payload} />
        <PayloadPanel label="Output" data={log.output_payload} />
      </div>
      {log.error_message && (
        <div className="px-4 py-2.5 border-t border-border bg-red-500/5">
          <p className="text-xs text-red-400 font-mono">{log.error_message}</p>
        </div>
      )}
    </div>
  )
}

function PayloadPanel({ label, data }: { label: string; data: unknown }) {
  return (
    <div className="p-4">
      <p className="text-[10px] text-gray-600 font-medium mb-2 uppercase tracking-wider">{label}</p>
      <pre className="text-[11px] text-gray-400 font-mono whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
        {data == null ? '—' : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
