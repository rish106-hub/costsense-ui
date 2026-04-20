import { useState } from 'react'
import { useAnomalies } from '../hooks/useAnomalies'
import { usePendingApproval } from '../hooks/usePendingApproval'
import { AnomalyCard } from '../components/anomalies/AnomalyCard'
import { AnomalyFilters } from '../components/anomalies/AnomalyFilters'
import { ApprovalCard } from '../components/anomalies/ApprovalCard'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Banner } from '../components/ui/Banner'
import { useBulkApprove, useBulkReject } from '../hooks/useBulkActions'
import { formatINR, cn } from '../lib/utils'
import { AlertTriangle, Clock, IndianRupee, CheckCircle, XCircle, Users } from 'lucide-react'

type Tab = 'all' | 'pending'

const INITIAL_FILTERS = { status: '', anomalyType: '', limit: 100 }

const inputCls = 'bg-bg border border-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cs-blue'

export default function Anomalies() {
  const [tab, setTab] = useState<Tab>('all')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkName, setBulkName] = useState('')
  const [bulkNotes, setBulkNotes] = useState('')

  const bulkApprove = useBulkApprove()
  const bulkReject = useBulkReject()

  const { data: anomaliesData, isLoading: anomaliesLoading, isError: anomaliesError } = useAnomalies({
    status: filters.status || undefined,
    limit: filters.limit,
    refetchInterval: 30_000,
  })

  const { data: pendingData, isLoading: pendingLoading, isError: pendingError } = usePendingApproval({
    assigned_to: assigneeFilter || undefined,
  })

  const pendingCount = pendingData?.count ?? 0
  const anomalies = anomaliesData?.anomalies ?? []
  const filtered = filters.anomalyType
    ? anomalies.filter(a => a.anomaly_type === filters.anomalyType)
    : anomalies

  const pendingList = pendingData?.pending ?? []
  const allPendingIds = pendingList.map(a => a.anomaly_id)
  const allSelected = allPendingIds.length > 0 && allPendingIds.every(id => selectedIds.has(id))

  function toggleSelect(id: string, checked: boolean) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(allPendingIds))
    }
  }

  function handleBulkApprove() {
    if (!bulkName.trim() || selectedIds.size === 0) return
    bulkApprove.mutate(
      { anomaly_ids: [...selectedIds], approved_by: bulkName, notes: bulkNotes || undefined },
      { onSuccess: () => { setSelectedIds(new Set()); setBulkName(''); setBulkNotes('') } }
    )
  }

  function handleBulkReject() {
    if (!bulkName.trim() || selectedIds.size === 0) return
    bulkReject.mutate(
      { anomaly_ids: [...selectedIds], rejected_by: bulkName, reason: bulkNotes || undefined },
      { onSuccess: () => { setSelectedIds(new Set()); setBulkName(''); setBulkNotes('') } }
    )
  }

  const isBulkPending = bulkApprove.isPending || bulkReject.isPending

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">Anomalies</h2>
          {anomaliesData && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                {formatINR(anomaliesData.total_exposure_inr)} exposure
              </span>
              <span className="flex items-center gap-1 text-cs-green">
                <IndianRupee className="w-3 h-3" />
                {formatINR(anomaliesData.total_recovered_inr)} recovered
              </span>
            </div>
          )}
        </div>

        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => { setTab('all'); setSelectedIds(new Set()) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === 'all' ? 'bg-cs-blue/20 text-cs-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            All
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${tab === 'all' ? 'bg-cs-blue/20 text-cs-blue' : 'bg-gray-700 text-gray-400'}`}>
              {anomaliesData?.count ?? 0}
            </span>
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === 'pending' ? 'bg-cs-orange/20 text-cs-orange' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3 h-3" />
            Pending
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none bg-cs-orange text-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === 'all' && (
        <>
          <AnomalyFilters filters={filters} onChange={setFilters} />
          {anomaliesLoading ? (
            <LoadingSpinner />
          ) : anomaliesError ? (
            <Banner variant="error" message="Could not load anomalies — check that the API is running." />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-2 text-gray-600">
              <AlertTriangle className="w-8 h-8 opacity-20" />
              <p className="text-sm">No anomalies</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map(a => <AnomalyCard key={a.anomaly_id} anomaly={a} />)}
            </div>
          )}
        </>
      )}

      {tab === 'pending' && (
        <>
          {/* Pending tab controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
              <Users className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <input
                className={cn(inputCls, 'flex-1')}
                placeholder="Filter by assignee"
                value={assigneeFilter}
                onChange={e => setAssigneeFilter(e.target.value)}
              />
            </div>
            {pendingList.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1.5 rounded border border-border hover:border-gray-500"
              >
                {allSelected ? 'Deselect all' : `Select all (${pendingList.length})`}
              </button>
            )}
          </div>

          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-card border border-cs-blue/30 rounded-xl px-4 py-3">
              <span className="text-xs font-semibold text-cs-blue mr-1">{selectedIds.size} selected</span>
              <input
                className={inputCls}
                placeholder="Your name (required)"
                value={bulkName}
                onChange={e => setBulkName(e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Notes / reason (optional)"
                value={bulkNotes}
                onChange={e => setBulkNotes(e.target.value)}
              />
              <button
                disabled={!bulkName.trim() || isBulkPending}
                onClick={handleBulkApprove}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  !bulkName.trim() || isBulkPending
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-cs-green/10 border border-cs-green/30 text-cs-green hover:bg-cs-green/20'
                )}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {bulkApprove.isPending ? 'Approving…' : 'Approve all'}
              </button>
              <button
                disabled={!bulkName.trim() || isBulkPending}
                onClick={handleBulkReject}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  !bulkName.trim() || isBulkPending
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-cs-red/10 border border-cs-red/30 text-cs-red hover:bg-cs-red/20'
                )}
              >
                <XCircle className="w-3.5 h-3.5" />
                {bulkReject.isPending ? 'Rejecting…' : 'Reject all'}
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="ml-auto text-xs text-gray-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {(bulkApprove.error || bulkReject.error) && (
            <Banner variant="error" message={(bulkApprove.error || bulkReject.error as Error)?.message ?? 'Bulk action failed'} />
          )}

          {pendingLoading ? (
            <LoadingSpinner />
          ) : pendingError ? (
            <Banner variant="error" message="Could not load pending approvals." />
          ) : pendingList.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-2 text-gray-600">
              <Clock className="w-8 h-8 opacity-20" />
              <p className="text-sm">No pending approvals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {pendingList.map(a => (
                <ApprovalCard
                  key={a.anomaly_id}
                  anomaly={a}
                  selected={selectedIds.has(a.anomaly_id)}
                  onSelect={toggleSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
