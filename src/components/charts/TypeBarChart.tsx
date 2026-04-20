import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#a78bfa', '#22c55e']

interface Props {
  data: Record<string, number>
}

const labelMap: Record<string, string> = {
  duplicate_payment: 'Duplicate',
  cloud_waste: 'Cloud Waste',
  unused_saas: 'Unused SaaS',
  vendor_rate_anomaly: 'Rate Anom.',
  sla_penalty_risk: 'SLA Risk',
}

export function TypeBarChart({ data }: Props) {
  const entries = Object.entries(data).map(([key, value]) => ({
    name: labelMap[key] ?? key,
    value,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={entries} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
        <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} width={72} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0c1525', border: '1px solid #1a2540', borderRadius: 6 }}
          labelStyle={{ color: '#e5e7eb' }}
          itemStyle={{ color: '#9ca3af' }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {entries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
