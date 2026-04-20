import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import type { ProcessLog } from '../../api/types'
import { fmtAgent } from '../../lib/utils'

interface Props {
  logs: ProcessLog[]
  onSelect?: (log: ProcessLog) => void
}

const STATUS_COLOR: Record<string, string> = {
  success: '#22c55e',
  error: '#ef4444',
  skipped: '#6b7280',
}

export function GanttChart({ logs, onSelect }: Props) {
  if (logs.length === 0) return <p className="text-gray-500 text-sm py-4">No logs to display.</p>

  const minStart = Math.min(...logs.map(l => new Date(l.started_at).getTime()))

  const data = logs.map(l => {
    const start = new Date(l.started_at).getTime()
    const offset = start - minStart
    const duration = l.duration_ms ?? 50
    return {
      name: fmtAgent(l.agent_name),
      offset,
      duration: Math.max(duration, 10),
      status: l.status,
      _log: l,
    }
  })

  const maxVal = Math.max(...data.map(d => d.offset + d.duration))

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 28 + 40)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
        onClick={(e: unknown) => {
          const ev = e as { activePayload?: { payload?: { _log?: ProcessLog } }[] }
          if (ev?.activePayload?.[0]?.payload?._log && onSelect) {
            onSelect(ev.activePayload[0].payload._log)
          }
        }}
      >
        <XAxis
          type="number"
          domain={[0, maxVal]}
          tick={{ fill: '#6b7280', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}s`}
        />
        <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} width={112} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0c1525', border: '1px solid #1a2540', borderRadius: 6 }}
          labelStyle={{ color: '#e5e7eb' }}
          itemStyle={{ color: '#9ca3af' }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          formatter={(v, name) => [
            name === 'offset' ? null : `${Number(v).toFixed(0)}ms`,
            name === 'duration' ? 'Duration' : null,
          ]}
        />
        <Bar dataKey="offset" stackId="g" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="duration" stackId="g" radius={[0, 3, 3, 0]} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={STATUS_COLOR[d.status] ?? '#6b7280'} />
          ))}
        </Bar>
        <Legend
          iconSize={8}
          wrapperStyle={{ fontSize: 10, color: '#9ca3af' }}
          content={() => (
            <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#9ca3af', paddingTop: 4 }}>
              {[{ label: 'success', color: '#22c55e' }, { label: 'error', color: '#ef4444' }, { label: 'skipped', color: '#6b7280' }].map(l => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: l.color, borderRadius: 2, display: 'inline-block' }} />
                  {l.label}
                </span>
              ))}
            </div>
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
