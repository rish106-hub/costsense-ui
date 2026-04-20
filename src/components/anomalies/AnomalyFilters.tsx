interface Filters {
  status: string
  anomalyType: string
  limit: number
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
}

const STATUSES = ['', 'detected', 'pending_approval', 'approved', 'auto_executed', 'rejected']
const TYPES = ['', 'duplicate_payment', 'cloud_waste', 'unused_saas', 'vendor_rate_anomaly', 'sla_penalty_risk']
const labelOf = (s: string, fallback: string) => s ? s.replace(/_/g, ' ') : fallback

const sel = 'bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cs-blue cursor-pointer capitalize'

export function AnomalyFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <select className={sel} value={filters.status} onChange={e => onChange({ ...filters, status: e.target.value })}>
        {STATUSES.map(s => <option key={s} value={s}>{labelOf(s, 'All statuses')}</option>)}
      </select>
      <select className={sel} value={filters.anomalyType} onChange={e => onChange({ ...filters, anomalyType: e.target.value })}>
        {TYPES.map(t => <option key={t} value={t}>{labelOf(t, 'All types')}</option>)}
      </select>
      <select className={sel} value={filters.limit} onChange={e => onChange({ ...filters, limit: Number(e.target.value) })}>
        {[25, 50, 100, 200].map(n => <option key={n} value={n}>{n} results</option>)}
      </select>
    </div>
  )
}
