import { useState } from 'react'
import { useSummary } from '../hooks/useSummary'
import { useBusEvents } from '../hooks/useBusEvents'
import { PipelineDiagram } from '../components/pipeline/PipelineDiagram'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Banner } from '../components/ui/Banner'
import { StatusBadge } from '../components/ui/StatusBadge'
import { fmtAgent, fmtDateTime } from '../lib/utils'
import { RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

const INTERVALS: { label: string; value: number | false }[] = [
  { label: 'Off', value: false },
  { label: '5s', value: 5_000 },
  { label: '10s', value: 10_000 },
  { label: '30s', value: 30_000 },
]

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

export default function Pipeline() {
  const qc = useQueryClient()
  const [refreshInterval, setRefreshInterval] = useState<number | false>(10_000)
  const [eventLimit, setEventLimit] = useState(50)

  const { data: summary, isLoading, isError } = useSummary(undefined, { refetchInterval: refreshInterval })
  const { data: busEvents, isLoading: eventsLoading } = useBusEvents({ limit: eventLimit, refetchInterval: refreshInterval })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <Banner variant="error" message="Backend offline — start the API server." />

  const agentStats = summary?.agent_stats ?? []
  const eventsByTopic = summary?.events_by_topic ?? {}
  const totalEvents = Object.values(eventsByTopic).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Pipeline</h2>
          <span className="text-[10px] text-gray-600 bg-bg border border-border rounded-full px-2 py-0.5">
            {totalEvents} events
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {INTERVALS.map(({ label, value }) => (
              <button key={label} onClick={() => setRefreshInterval(value)}
                className={`px-2.5 py-1.5 text-xs transition-colors ${
                  refreshInterval === value ? 'bg-cs-blue text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >{label}</button>
            ))}
          </div>
          <button onClick={() => { qc.invalidateQueries({ queryKey: ['summary'] }); qc.invalidateQueries({ queryKey: ['bus-events'] }) }}
            className="p-1.5 rounded-lg border border-border text-gray-500 hover:text-white hover:border-gray-500 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Diagram */}
      <SectionCard title="Agent Topology">
        <PipelineDiagram agentStats={agentStats} eventsByTopic={eventsByTopic} />
      </SectionCard>

      {/* Agent table */}
      <SectionCard title="Agents">
        <div className="divide-y divide-border">
          {agentStats.map(s => {
            const status = s.events_processed === 0 ? 'idle' : s.errors > 0 ? 'error' : s.avg_duration_ms > 5000 ? 'warning' : 'healthy'
            return (
              <div key={s.agent_name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 text-xs">
                <StatusBadge status={status} className="shrink-0" />
                <span className="text-gray-300 flex-1">{fmtAgent(s.agent_name)}</span>
                <span className="text-white font-semibold w-10 text-right">{s.events_processed}</span>
                {s.errors > 0
                  ? <span className="text-cs-red w-14 text-right">{s.errors} errors</span>
                  : <span className="text-gray-600 w-14 text-right">{s.avg_duration_ms.toFixed(0)}ms</span>
                }
                <span className="text-gray-600 w-24 text-right hidden lg:block">{s.last_seen ? fmtDateTime(s.last_seen).slice(0, 10) : '—'}</span>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Event feed */}
      <SectionCard title="Event Feed"
        action={
          <div className="flex rounded-lg border border-border overflow-hidden">
            {[25, 50, 100].map(n => (
              <button key={n} onClick={() => setEventLimit(n)}
                className={`px-2 py-1 text-xs transition-colors ${
                  eventLimit === n ? 'bg-cs-blue/20 text-cs-blue' : 'text-gray-500 hover:text-white'
                }`}>{n}</button>
            ))}
          </div>
        }
      >
        {eventsLoading ? <LoadingSpinner /> : busEvents && busEvents.events.length > 0 ? (
          <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin">
            {busEvents.events.map(ev => (
              <div key={ev.event_id} className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-bg border border-border/40 text-xs hover:border-border transition-colors">
                <span className="text-gray-600 shrink-0 w-20 font-mono">{fmtDateTime(ev.timestamp).slice(11, 19)}</span>
                <span className="text-cs-blue shrink-0 font-mono">{ev.topic}</span>
                <span className="text-gray-500 shrink-0 truncate flex-1">{ev.source_agent}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-xs py-8 text-center">Run a pipeline to see events</p>
        )}
      </SectionCard>
    </div>
  )
}
