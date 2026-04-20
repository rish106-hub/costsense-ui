import { useState } from 'react'
import { useSummary } from '../hooks/useSummary'
import { useProcesses } from '../hooks/useProcesses'
import { KpiCard } from '../components/ui/KpiCard'
import { StatusPieChart } from '../components/charts/StatusPieChart'
import { TypeBarChart } from '../components/charts/TypeBarChart'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScoreBar } from '../components/ui/ScoreBar'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Banner } from '../components/ui/Banner'
import { formatINR, fmtAgent, fmtDateTime } from '../lib/utils'
import { RefreshCw, AlertTriangle, IndianRupee, TrendingUp, Clock } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">{title}</span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function Summary() {
  const qc = useQueryClient()
  const [selectedProcessId, setSelectedProcessId] = useState<string | undefined>()

  const { data: processes } = useProcesses(20)
  const { data: summary, isLoading, isError, refetch } = useSummary(selectedProcessId)

  if (isLoading) return <LoadingSpinner />
  if (isError) return <Banner variant="error" message="Backend offline — start the API server." />

  const recovered = summary?.recovery_rate_pct ?? 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-semibold text-white">Summary</h2>
        <div className="flex items-center gap-2">
          <select
            className="bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cs-blue"
            value={selectedProcessId ?? ''}
            onChange={e => setSelectedProcessId(e.target.value || undefined)}
          >
            <option value="">All time</option>
            {(processes?.processes ?? []).map(p => (
              <option key={p.process_id} value={p.process_id}>
                {fmtDateTime(p.started_at)} · {p.record_count} records
              </option>
            ))}
          </select>
          <button
            onClick={() => { refetch(); qc.invalidateQueries({ queryKey: ['summary'] }) }}
            className="p-1.5 rounded-lg border border-border text-gray-500 hover:text-white hover:border-gray-500 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={AlertTriangle} label="Anomalies" value={summary?.anomalies_detected ?? 0} sub={`${summary?.open ?? 0} open`} accent="blue" />
        <KpiCard icon={IndianRupee}   label="Exposure"  value={summary ? formatINR(summary.total_exposure_inr) : '—'} accent="red" />
        <KpiCard icon={TrendingUp}    label="Recovered" value={summary ? formatINR(summary.total_recovered_inr) : '—'} sub={`${recovered}%`} accent="green" />
        <KpiCard icon={Clock}         label="Pending"   value={summary?.pending_approval ?? 0} sub={summary ? formatINR(summary.pending_exposure_inr) : ''} accent="orange" />
      </div>

      {/* Recovery bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Recovery rate</span>
          <span className={`text-sm font-bold ${recovered >= 50 ? 'text-cs-green' : 'text-cs-red'}`}>{recovered}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${recovered >= 50 ? 'bg-cs-green' : 'bg-cs-red'}`}
            style={{ width: `${Math.min(100, recovered)}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Status">
            {Object.keys(summary.status_distribution).length > 0
              ? <StatusPieChart data={summary.status_distribution} />
              : <p className="text-gray-600 text-xs py-8 text-center">No data</p>}
          </SectionCard>
          <SectionCard title="Types">
            {Object.keys(summary.anomaly_breakdown).length > 0
              ? <TypeBarChart data={summary.anomaly_breakdown} />
              : <p className="text-gray-600 text-xs py-8 text-center">No data</p>}
          </SectionCard>
        </div>
      )}

      {/* Top anomaly */}
      {summary?.top_anomaly && (
        <SectionCard title="Top Priority Anomaly">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <StatusBadge status={summary.top_anomaly.anomaly_type} />
                <StatusBadge status={summary.top_anomaly.status} />
              </div>
              <span className="text-xl font-bold text-cs-orange">{summary.top_anomaly.aps_score?.toFixed(1) ?? '—'} <span className="text-xs text-gray-500 font-normal">APS</span></span>
            </div>
            {summary.top_anomaly.root_cause && (
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{summary.top_anomaly.root_cause}</p>
            )}
            {summary.top_anomaly.suggested_action && (
              <p className="text-xs text-cs-blue bg-cs-blue/5 border border-cs-blue/15 rounded-lg px-3 py-2">
                {summary.top_anomaly.suggested_action}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border text-xs">
              <div>
                <p className="text-gray-600 mb-1 text-[10px]">APS</p>
                <ScoreBar score={summary.top_anomaly.aps_score} />
              </div>
              <div>
                <p className="text-gray-600 mb-1 text-[10px]">Confidence</p>
                <ScoreBar score={summary.top_anomaly.confidence != null ? summary.top_anomaly.confidence * 10 : null} max={10} />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Agent stats */}
      {summary && summary.agent_stats.length > 0 && (
        <SectionCard title="Agent Performance">
          <div className="divide-y divide-border">
            {summary.agent_stats.map(s => {
              const hasActivity = s.events_processed > 0
              return (
                <div key={s.agent_name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    !hasActivity ? 'bg-gray-600' : s.errors > 0 ? 'bg-cs-red' : 'bg-cs-green'
                  }`} />
                  <span className="text-xs text-gray-300 flex-1">{fmtAgent(s.agent_name)}</span>
                  <span className="text-xs font-semibold text-white w-12 text-right">{s.events_processed}</span>
                  {s.errors > 0
                    ? <span className="text-xs text-cs-red w-10 text-right">{s.errors} err</span>
                    : <span className="text-xs text-gray-600 w-10 text-right">{s.avg_duration_ms.toFixed(0)}ms</span>
                  }
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
