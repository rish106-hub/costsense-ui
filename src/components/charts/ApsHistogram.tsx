import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Anomaly } from '../../api/types'

interface Props {
  anomalies: Anomaly[]
}

function scoreColor(bin: number): string {
  if (bin >= 7) return '#22c55e'
  if (bin >= 4) return '#f59e0b'
  return '#ef4444'
}

export function ApsHistogram({ anomalies }: Props) {
  const bins: Record<number, number> = {}
  for (let i = 0; i <= 10; i++) bins[i] = 0

  anomalies.forEach(a => {
    if (a.aps_score != null) {
      const bin = Math.min(10, Math.floor(a.aps_score))
      bins[bin] = (bins[bin] ?? 0) + 1
    }
  })

  const data = Object.entries(bins).map(([k, v]) => ({ bin: Number(k), count: v }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 4, bottom: 4 }}>
        <XAxis dataKey="bin" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0c1525', border: '1px solid #1a2540', borderRadius: 6 }}
          labelStyle={{ color: '#e5e7eb' }}
          itemStyle={{ color: '#9ca3af' }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          formatter={(v) => [v, 'Count']}
          labelFormatter={(l) => `APS Score: ${l}`}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={scoreColor(d.bin)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
