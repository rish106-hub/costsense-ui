import { cn } from '../../lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="w-8 h-8 border-2 border-gray-600 border-t-cs-blue rounded-full animate-spin" />
    </div>
  )
}
