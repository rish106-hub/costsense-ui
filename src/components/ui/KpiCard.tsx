import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  sub?: string
  accent?: 'green' | 'orange' | 'red' | 'blue' | 'purple'
  className?: string
}

const accentMap = {
  green:  { border: 'border-cs-green/30',  iconBg: 'bg-cs-green/10  text-cs-green'  },
  orange: { border: 'border-cs-orange/30', iconBg: 'bg-cs-orange/10 text-cs-orange' },
  red:    { border: 'border-cs-red/30',    iconBg: 'bg-cs-red/10    text-cs-red'    },
  blue:   { border: 'border-cs-blue/30',   iconBg: 'bg-cs-blue/10   text-cs-blue'   },
  purple: { border: 'border-cs-purple/30', iconBg: 'bg-cs-purple/10 text-cs-purple' },
}

export function KpiCard({ label, value, icon: Icon, sub, accent = 'blue', className }: KpiCardProps) {
  const a = accentMap[accent]
  return (
    <div className={cn('bg-card rounded-xl border p-4 flex items-center gap-3', a.border, className)}>
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', a.iconBg)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white leading-tight truncate">{value}</p>
        {sub && <p className="text-[10px] text-gray-600 truncate">{sub}</p>}
      </div>
    </div>
  )
}
