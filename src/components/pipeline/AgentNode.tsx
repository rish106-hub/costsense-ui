import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import type { AgentStatus } from '../../api/types'

interface AgentNodeProps {
  id: string
  label: string
  status: AgentStatus
  eventsProcessed?: number
  avgDuration?: number
  passive?: boolean
  style?: React.CSSProperties
}

const statusStyles: Record<AgentStatus, string> = {
  healthy: 'border-cs-green text-cs-green',
  warning: 'border-cs-orange text-cs-orange',
  error:   'border-cs-red text-cs-red',
  idle:    'border-gray-600 text-gray-500',
}

const dotColors: Record<AgentStatus, string> = {
  healthy: 'bg-cs-green',
  warning: 'bg-cs-orange',
  error:   'bg-cs-red',
  idle:    'bg-gray-600',
}

export function AgentNode({ id, label, status, eventsProcessed, avgDuration, passive, style }: AgentNodeProps) {
  const isHealthy = status === 'healthy'

  return (
    <motion.div
      className={cn(
        'absolute flex flex-col items-center justify-center rounded-lg border-2 bg-card cursor-default',
        'w-36 h-16 text-center px-2',
        passive ? 'border-dashed' : '',
        statusStyles[status],
      )}
      style={style}
      animate={isHealthy ? {
        boxShadow: [
          '0 0 0 0 rgba(34,197,94,0.4)',
          '0 0 0 8px rgba(34,197,94,0)',
          '0 0 0 0 rgba(34,197,94,0)',
        ],
      } : {}}
      transition={isHealthy ? { repeat: Infinity, duration: 2, ease: 'easeOut' } : {}}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[status])} />
        <span className="text-[10px] font-bold text-gray-500">{id}</span>
      </div>
      <p className="text-[11px] font-semibold leading-tight text-white">{label}</p>
      {eventsProcessed !== undefined && (
        <p className="text-[9px] text-gray-500 mt-0.5">{eventsProcessed} events · {avgDuration?.toFixed(0) ?? '—'}ms</p>
      )}
    </motion.div>
  )
}
