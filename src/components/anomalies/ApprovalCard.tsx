import { useState } from 'react'
import type { Anomaly } from '../../api/types'
import { AnomalyCard } from './AnomalyCard'
import { useApproveAnomaly } from '../../hooks/useApproveAnomaly'
import { useRejectAnomaly } from '../../hooks/useRejectAnomaly'
import { useAssignAnomaly } from '../../hooks/useAssignAnomaly'
import { cn } from '../../lib/utils'
import { CheckCircle, XCircle, UserPlus, Check, X } from 'lucide-react'

interface Props {
  anomaly: Anomaly
  selected?: boolean
  onSelect?: (id: string, checked: boolean) => void
}

type Mode = 'idle' | 'approve' | 'reject' | 'assign'

const inputCls = 'w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cs-blue'

export function ApprovalCard({ anomaly, selected, onSelect }: Props) {
  const [mode, setMode] = useState<Mode>('idle')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [assignee, setAssignee] = useState(anomaly.assigned_to ?? '')

  const approve = useApproveAnomaly()
  const reject = useRejectAnomaly()
  const assign = useAssignAnomaly()

  const isDone = approve.isSuccess || reject.isSuccess
  const isPending = approve.isPending || reject.isPending || assign.isPending
  const err = approve.error || reject.error || assign.error

  if (isDone) {
    const wasApproved = approve.isSuccess
    return (
      <div className={cn(
        'rounded-xl border p-4 flex items-center gap-3 text-sm font-medium',
        wasApproved
          ? 'bg-cs-green/10 border-cs-green/30 text-cs-green'
          : 'bg-cs-red/10 border-cs-red/30 text-cs-red'
      )}>
        {wasApproved ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {wasApproved ? 'Approved' : 'Rejected'}
        {name && <span className="text-xs font-normal opacity-60">by {name}</span>}
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-card rounded-xl border transition-colors',
      selected ? 'border-cs-blue/50' : 'border-cs-orange/25',
    )}>
      {/* Selection checkbox row */}
      {onSelect && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-0">
          <input
            type="checkbox"
            checked={selected ?? false}
            onChange={e => onSelect(anomaly.anomaly_id, e.target.checked)}
            className="accent-cs-blue w-4 h-4 cursor-pointer"
          />
          <span className="text-[10px] text-gray-600">Select for bulk action</span>
          {anomaly.assigned_to && (
            <span className="ml-auto text-[10px] text-gray-500 flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> {anomaly.assigned_to}
            </span>
          )}
        </div>
      )}

      <div className="p-4 space-y-4">
        <AnomalyCard anomaly={anomaly} />

        {/* Action buttons */}
        {mode === 'idle' && (
          <div className="flex gap-2 border-t border-border pt-3">
            <button onClick={() => setMode('approve')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cs-green/10 border border-cs-green/30 text-cs-green text-xs font-semibold hover:bg-cs-green/20 transition-colors">
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={() => setMode('reject')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cs-red/10 border border-cs-red/30 text-cs-red text-xs font-semibold hover:bg-cs-red/20 transition-colors">
              <X className="w-3.5 h-3.5" /> Reject
            </button>
            <button onClick={() => setMode('assign')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-bg border border-border text-gray-400 text-xs hover:text-white hover:border-gray-500 transition-colors">
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Approve form */}
        {mode === 'approve' && (
          <div className="border-t border-border pt-3 space-y-2">
            <input className={inputCls} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            <textarea className={cn(inputCls, 'resize-none')} placeholder="Notes (optional)" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
            {err && <p className="text-xs text-cs-red">{(err as Error)?.message}</p>}
            <div className="flex gap-2">
              <button
                disabled={!name.trim() || isPending}
                onClick={() => approve.mutate({ id: anomaly.anomaly_id, approved_by: name, notes: notes || undefined })}
                className={cn('flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5',
                  !name.trim() || isPending ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-cs-green text-white hover:bg-cs-green/80'
                )}>
                <CheckCircle className="w-4 h-4" />
                {isPending ? 'Approving…' : 'Confirm Approve'}
              </button>
              <button onClick={() => setMode('idle')} className="px-3 py-2 rounded-lg border border-border text-gray-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reject form */}
        {mode === 'reject' && (
          <div className="border-t border-border pt-3 space-y-2">
            <input className={inputCls} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            <textarea className={cn(inputCls, 'resize-none')} placeholder="Reason for rejection" rows={2} value={reason} onChange={e => setReason(e.target.value)} />
            {err && <p className="text-xs text-cs-red">{(err as Error)?.message}</p>}
            <div className="flex gap-2">
              <button
                disabled={!name.trim() || isPending}
                onClick={() => reject.mutate({ id: anomaly.anomaly_id, rejected_by: name, reason: reason || undefined })}
                className={cn('flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5',
                  !name.trim() || isPending ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-cs-red text-white hover:bg-cs-red/80'
                )}>
                <XCircle className="w-4 h-4" />
                {isPending ? 'Rejecting…' : 'Confirm Reject'}
              </button>
              <button onClick={() => setMode('idle')} className="px-3 py-2 rounded-lg border border-border text-gray-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Assign form */}
        {mode === 'assign' && (
          <div className="border-t border-border pt-3 space-y-2">
            <input className={inputCls} placeholder="Assign to (name or email)" value={assignee} onChange={e => setAssignee(e.target.value)} autoFocus />
            {assign.isSuccess && (
              <p className="text-xs text-cs-green">Assigned to {assignee}</p>
            )}
            {err && <p className="text-xs text-cs-red">{(err as Error)?.message}</p>}
            <div className="flex gap-2">
              <button
                disabled={!assignee.trim() || isPending}
                onClick={() => assign.mutate({ id: anomaly.anomaly_id, assigned_to: assignee.trim() })}
                className={cn('flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5',
                  !assignee.trim() || isPending ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-cs-blue text-white hover:bg-cs-blue/80'
                )}>
                <UserPlus className="w-4 h-4" />
                {isPending ? 'Assigning…' : 'Assign'}
              </button>
              <button onClick={() => setMode('idle')} className="px-3 py-2 rounded-lg border border-border text-gray-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
