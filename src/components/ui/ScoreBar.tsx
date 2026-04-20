import { cn } from '../../lib/utils'

interface ScoreBarProps {
  score: number | null
  max?: number
  className?: string
  showLabel?: boolean
}

function scoreColor(score: number, max: number): string {
  const ratio = score / max
  if (ratio >= 0.7) return 'bg-cs-green'
  if (ratio >= 0.4) return 'bg-cs-orange'
  return 'bg-cs-red'
}

export function ScoreBar({ score, max = 10, className, showLabel = true }: ScoreBarProps) {
  if (score == null) return <span className="text-gray-500 text-xs">—</span>
  const pct = Math.min(100, (score / max) * 100)
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', scoreColor(score, max))} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-gray-400 w-6 text-right">{score.toFixed(1)}</span>}
    </div>
  )
}
