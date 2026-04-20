import { useState } from 'react'
import { useProcesses } from '../hooks/useProcesses'
import { useProcessTrace } from '../hooks/useProcessTrace'
import { useLogs } from '../hooks/useLogs'
import { ProcessSelector } from '../components/logs/ProcessSelector'
import { GanttChart } from '../components/charts/GanttChart'
import { PayloadInspector } from '../components/logs/PayloadInspector'
import { StatusBadge } from '../components/ui/StatusBadge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { fmtAgent, fmtDateTime } from '../lib/utils'
import type { ProcessLog } from '../api/types'
import { FileText, BarChart2 } from 'lucide-react'

const AGENTS = [
  'agent_01_data_connector', 'agent_02_normalization', 'agent_03_anomaly_detection',
  'agent_04_root_cause', 'agent_05_prioritization', 'agent_06_merge',
  'agent_07_action_dispatcher', 'agent_08_workflow_executor', 'agent_09_audit_trail',
]

type View = 'table' | 'gantt'

export default function Logs() {
  const [selectedProcessId, setSelectedProcessId] = useState<string | undefined>()
  const [agentFilter, setAgentFilter] = useState('')
  const [selectedLog, setSelectedLog] = useState<ProcessLog | null>(null)
  const [view, setView] = useState<View>('table')

  const { data: processesData, isLoading: processesLoading } = useProcesses(50)
  const { data: traceData, isLoading: traceLoading } = useProcessTrace(selectedProcessId)
  const { data: allLogs, isLoading: allLogsLoading } = useLogs({ limit: 100 })

  const processes = processesData?.processes ?? []
  const logs = (selectedProcessId ? (traceData?.logs ?? []) : (allLogs?.logs ?? []))
    .filter(l => !agentFilter || l.agent_name === agentFilter)
  const isLoading = selectedProcessId ? traceLoading : allLogsLoading

  const sel = 'bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cs-blue'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-semibold text-white">Logs</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {processesLoading ? null : processes.length > 0
            ? <ProcessSelector processes={processes} selectedId={selectedProcessId} onSelect={setSelectedProcessId} />
            : null
          }
          <select className={sel} value={agentFilter} onChange={e => setAgentFilter(e.target.value)}>
            <option value="">All agents</option>
            {AGENTS.map(a => <option key={a} value={a}>{fmtAgent(a)}</option>)}
          </select>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setView('table')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${view === 'table' ? 'bg-cs-blue/20 text-cs-blue' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <FileText className="w-3 h-3" />
            </button>
            <button onClick={() => setView('gantt')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${view === 'gantt' ? 'bg-cs-blue/20 text-cs-blue' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <BarChart2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Payload inspector */}
      {selectedLog && <PayloadInspector log={selectedLog} onClose={() => setSelectedLog(null)} />}

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-2 text-gray-600">
          <FileText className="w-8 h-8 opacity-20" />
          <p className="text-sm">No logs</p>
        </div>
      ) : view === 'gantt' ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Timeline</span>
            <span className="text-[10px] text-gray-600">{logs.length} entries</span>
          </div>
          <div className="p-4">
            <GanttChart logs={logs} onSelect={setSelectedLog} />
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Logs</span>
            <span className="text-[10px] text-gray-600">{logs.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Agent', 'Status', 'Topic In → Out', 'Duration', 'Time'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[10px] text-gray-600 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.log_id} onClick={() => setSelectedLog(log)}
                    className="border-b border-border/40 hover:bg-bg/50 cursor-pointer text-xs">
                    <td className="px-3 py-2 text-gray-300">{fmtAgent(log.agent_name)}</td>
                    <td className="px-3 py-2"><StatusBadge status={log.status} /></td>
                    <td className="px-3 py-2 text-gray-600 font-mono whitespace-nowrap">
                      {[log.topic_in, log.topic_out].filter(Boolean).join(' → ') || '—'}
                    </td>
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                      {log.duration_ms != null ? `${log.duration_ms}ms` : '—'}
                    </td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{fmtDateTime(log.started_at).slice(11, 19)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
