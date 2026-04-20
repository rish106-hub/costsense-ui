import { useSummary } from '../hooks/useSummary'
import { useAnomalies } from '../hooks/useAnomalies'
import { useHealth } from '../hooks/useHealth'
import { KpiCard } from '../components/ui/KpiCard'
import { StatusPieChart } from '../components/charts/StatusPieChart'
import { TypeBarChart } from '../components/charts/TypeBarChart'
import { ApsHistogram } from '../components/charts/ApsHistogram'
import { StatusBadge } from '../components/ui/StatusBadge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Banner } from '../components/ui/Banner'
import { formatINR, fmtDateTime } from '../lib/utils'
import { RefreshCw, AlertTriangle, IndianRupee, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <span className="text-xs font-medium text-gray-400">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function EmptyChart() {
  return <p className="text-gray-600 text-xs py-8 text-center">Run a pipeline to see data</p>
}

export default function Dashboard() {
  const qc = useQueryClient()
  const { data: health } = useHealth({ refetchInterval: 15_000 })
  const { data: summary, isLoading, isError } = useSummary(undefined, { refetchInterval: 15_000 })
  const { data: anomaliesData } = useAnomalies({ limit: 200 })

  const handleRefresh = () => {
    qc.invalidateQueries({ queryKey: ['summary'] })
    qc.invalidateQueries({ queryKey: ['anomalies'] })
    qc.invalidateQueries({ queryKey: ['health'] })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <Banner variant="error" message="Backend offline — start the API server and refresh." />

  const top = summary?.top_anomaly

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Dashboard</h2>
          {health && (
            <span className="text-[10px] text-gray-600 bg-bg border border-border rounded-full px-2 py-0.5">
              {health.events_processed} events
            </span>
          )}
        </div>
        <button onClick={handleRefresh} className="p-1.5 rounded-lg border border-border text-gray-500 hover:text-white hover:border-gray-500 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={AlertTriangle} label="Anomalies" value={summary?.anomalies_detected ?? 0} sub={`${summary?.open ?? 0} open`} accent="blue" />
        <KpiCard icon={IndianRupee}   label="Exposure"  value={summary ? formatINR(summary.total_exposure_inr) : '—'} accent="red" />
        <KpiCard icon={TrendingUp}    label="Recovered" value={summary ? formatINR(summary.total_recovered_inr) : '—'} sub={`${summary?.recovery_rate_pct ?? 0}%`} accent="green" />
        <KpiCard icon={Clock}         label="Pending"   value={summary?.pending_approval ?? 0} sub="awaiting sign-off" accent="orange" />
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={CheckCircle}   label="Resolved"       value={summary?.resolved ?? 0}         accent="purple" />
        <KpiCard icon={AlertTriangle} label="Agents"         value={summary?.agents_active ?? 0}    accent="blue"   />
        <KpiCard icon={IndianRupee}   label="Pending Risk"   value={summary ? formatINR(summary.pending_exposure_inr) : '—'} accent="orange" />
        <KpiCard icon={TrendingUp}    label="Pipeline Events" value={health?.events_processed ?? 0} accent="purple" />
      </div>

      {/* Charts */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Status">
            {Object.keys(summary.status_distribution).length > 0
              ? <StatusPieChart data={summary.status_distribution} />
              : <EmptyChart />}
          </SectionCard>
          <SectionCard title="Types">
            {Object.keys(summary.anomaly_breakdown).length > 0
              ? <TypeBarChart data={summary.anomaly_breakdown} />
              : <EmptyChart />}
          </SectionCard>
          <SectionCard title="APS Distribution">
            {anomaliesData && anomaliesData.anomalies.length > 0
              ? <ApsHistogram anomalies={anomaliesData.anomalies} />
              : <EmptyChart />}
          </SectionCard>
        </div>
      )}

      {/* Top anomaly */}
      {top && (
        <div className="bg-card border border-cs-orange/20 rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Top Priority</span>
                <div className="flex gap-1.5">
                  <StatusBadge status={top.anomaly_type} />
                  <StatusBadge status={top.status} />
                </div>
              </div>
              {top.root_cause && <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{top.root_cause}</p>}
              {top.suggested_action && <p className="text-xs text-cs-blue">{top.suggested_action}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-cs-orange">{top.aps_score?.toFixed(1) ?? '—'}</p>
              <p className="text-[10px] text-gray-600">APS</p>
              <p className="text-[10px] text-gray-600 mt-1">{fmtDateTime(top.detected_at).slice(0, 10)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bus topics */}
      {health && Object.keys(health.topics).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(health.topics).map(([topic, count]) => (
            <div key={topic} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cs-blue shrink-0" />
              <span className="text-gray-500">{topic}</span>
              <span className="font-semibold text-white">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
