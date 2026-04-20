import { cn } from '../../lib/utils'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'

type Variant = 'info' | 'success' | 'warning' | 'error'

const config: Record<Variant, { icon: React.ComponentType<{ className?: string }>, border: string, bg: string, text: string }> = {
  info:    { icon: Info,         border: 'border-cs-blue',   bg: 'bg-cs-blue/10',   text: 'text-cs-blue' },
  success: { icon: CheckCircle,  border: 'border-cs-green',  bg: 'bg-cs-green/10',  text: 'text-cs-green' },
  warning: { icon: AlertCircle,  border: 'border-cs-orange', bg: 'bg-cs-orange/10', text: 'text-cs-orange' },
  error:   { icon: XCircle,      border: 'border-cs-red',    bg: 'bg-cs-red/10',    text: 'text-cs-red' },
}

interface BannerProps {
  variant?: Variant
  message: string
  dismissible?: boolean
  className?: string
}

export function Banner({ variant = 'info', message, dismissible = true, className }: BannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  const { icon: Icon, border, bg, text } = config[variant]
  return (
    <div className={cn('flex items-start gap-3 rounded-lg border-l-4 p-3', border, bg, className)}>
      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', text)} />
      <p className="flex-1 text-sm text-gray-200">{message}</p>
      {dismissible && (
        <button onClick={() => setDismissed(true)} className="text-gray-500 hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
