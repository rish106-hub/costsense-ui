import { AgentNode } from './AgentNode'
import { TopicBox } from './TopicBox'
import type { AgentStat, AgentStatus } from '../../api/types'

interface Props {
  agentStats: AgentStat[]
  eventsByTopic: Record<string, number>
}

function deriveStatus(stats: AgentStat[], agentName: string): AgentStatus {
  const s = stats.find(x => x.agent_name === agentName)
  if (!s || s.events_processed === 0) return 'idle'
  if (s.errors > 0) return 'error'
  if (s.avg_duration_ms > 5000) return 'warning'
  return 'healthy'
}

function getStats(stats: AgentStat[], agentName: string) {
  const s = stats.find(x => x.agent_name === agentName)
  return { eventsProcessed: s?.events_processed ?? 0, avgDuration: s?.avg_duration_ms ?? 0 }
}

const AGENTS = [
  { id: 'A01', name: 'agent_01_data_connector',   label: 'Data Connector',    x: 400, y: 20  },
  { id: 'A02', name: 'agent_02_normalization',     label: 'Normalization',     x: 400, y: 120 },
  { id: 'A03', name: 'agent_03_anomaly_detection', label: 'Anomaly Detection', x: 400, y: 220 },
  { id: 'A04', name: 'agent_04_root_cause',        label: 'Root Cause LLM',   x: 200, y: 340 },
  { id: 'A05', name: 'agent_05_prioritization',    label: 'Prioritization',   x: 600, y: 340 },
  { id: 'A06', name: 'agent_06_merge_enrich',      label: 'Merge & Enrich',   x: 400, y: 460 },
  { id: 'A07', name: 'agent_07_action_dispatcher', label: 'Action Dispatcher', x: 400, y: 560 },
  { id: 'A08', name: 'agent_08_workflow_executor', label: 'Workflow Executor', x: 400, y: 660 },
  { id: 'A09', name: 'agent_09_audit_trail',       label: 'Audit Trail',      x: 710, y: 560, passive: true },
]

const cx = (x: number) => x + 72
const cy = (y: number) => y + 32

const ARROWS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 6, to: 8, dashed: true },
]

const TOPICS = [
  { key: 'raw_spend',          label: 'raw_spend',          x: 560, y: 56  },
  { key: 'normalized_spend',   label: 'normalized_spend',   x: 560, y: 156 },
  { key: 'anomalies_detected', label: 'anomalies_detected', x: 560, y: 256 },
  { key: 'enriched_anomalies', label: 'enriched_anomalies', x: 560, y: 496 },
]

export function PipelineDiagram({ agentStats, eventsByTopic }: Props) {
  return (
    <div className="relative w-full overflow-x-auto">
      <div className="relative mx-auto" style={{ width: 960, height: 760 }}>
        <svg className="absolute inset-0 pointer-events-none" width={960} height={760}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#1a2540" />
            </marker>
            <marker id="arrow-dashed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#374151" />
            </marker>
          </defs>
          {ARROWS.map((arrow, i) => {
            const from = AGENTS[arrow.from]
            const to = AGENTS[arrow.to]
            const x1 = cx(from.x)
            const y1 = cy(from.y) + 32
            const x2 = cx(to.x)
            const y2 = cy(to.y) - 32
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={arrow.dashed ? '#374151' : '#1a2540'}
                strokeWidth={1.5}
                strokeDasharray={arrow.dashed ? '4 2' : undefined}
                markerEnd={arrow.dashed ? 'url(#arrow-dashed)' : 'url(#arrow)'}
              />
            )
          })}
          <text x={310} y={400} textAnchor="middle" fill="#6b7280" fontSize={9}>Root Cause</text>
          <text x={690} y={400} textAnchor="middle" fill="#6b7280" fontSize={9}>Prioritization</text>
          <text x={335} y={615} textAnchor="middle" fill="#6b7280" fontSize={9}>Auto Execute</text>
          <text x={545} y={615} textAnchor="middle" fill="#6b7280" fontSize={9}>Approval Queue</text>
        </svg>

        {AGENTS.map((a) => {
          const status = deriveStatus(agentStats, a.name)
          const { eventsProcessed, avgDuration } = getStats(agentStats, a.name)
          return (
            <AgentNode
              key={a.id}
              id={a.id}
              label={a.label}
              status={status}
              eventsProcessed={eventsProcessed}
              avgDuration={avgDuration}
              passive={a.passive}
              style={{ left: a.x, top: a.y }}
            />
          )
        })}

        {TOPICS.map((t) => (
          <TopicBox
            key={t.key}
            topic={t.label}
            count={eventsByTopic[t.key] ?? 0}
            style={{ left: t.x, top: t.y }}
          />
        ))}
      </div>
    </div>
  )
}
