import { cn } from '../../lib/utils'

interface TopicBoxProps {
  topic: string
  count: number
  style?: React.CSSProperties
}

export function TopicBox({ topic, count, style }: TopicBoxProps) {
  const active = count > 0
  return (
    <div
      className={cn(
        'absolute flex flex-col items-center justify-center rounded border px-2 py-1 text-center w-28',
        active ? 'border-cs-blue/50 bg-cs-blue/10' : 'border-gray-700 bg-bg',
      )}
      style={style}
    >
      <p className="text-[9px] text-gray-500 truncate w-full text-center">{topic}</p>
      <p className={cn('text-sm font-bold', active ? 'text-cs-blue' : 'text-gray-600')}>{count}</p>
    </div>
  )
}
