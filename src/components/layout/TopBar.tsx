import { useHealth } from '../../hooks/useHealth'
import { cn } from '../../lib/utils'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { data, isError } = useHealth()
  const online = !!data && !isError

  return (
    <div className="h-12 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
      <h1 className="text-sm font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-2">
        <span className={cn('w-2 h-2 rounded-full', online ? 'bg-cs-green animate-pulse' : 'bg-cs-red')} />
        <span className="text-xs text-gray-400">{online ? 'API Online' : 'API Offline'}</span>
      </div>
    </div>
  )
}
