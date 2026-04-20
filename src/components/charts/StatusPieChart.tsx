import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  detected: '#3b82f6',
  pending_approval: '#f59e0b',
  approved: '#22c55e',
  auto_executed: '#a78bfa',
  rejected: '#ef4444',
}

interface Props {
  data: Record<string, number>
}

export function StatusPieChart({ data }: Props) {
  const entries = Object.entries(data).map(([key, value]) => ({
    name: key.replace(/_/g, ' '),
    value,
    key,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={entries}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={70}
          innerRadius={40}
          paddingAngle={2}
        >
          {entries.map((e, i) => (
            <Cell key={i} fill={STATUS_COLORS[e.key] ?? '#6b7280'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#0c1525', border: '1px solid #1a2540', borderRadius: 6 }}
          itemStyle={{ color: '#9ca3af' }}
          formatter={(v, n) => [v, n]}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          wrapperStyle={{ fontSize: 10, color: '#9ca3af' }}
          formatter={(v) => v}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
