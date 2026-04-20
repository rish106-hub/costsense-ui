import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useIngestDemo } from '../hooks/useIngestDemo'
import { useIngestBatch } from '../hooks/useIngestBatch'
import { useSyntheticData } from '../hooks/useSyntheticData'
import { Banner } from '../components/ui/Banner'
import { cn } from '../lib/utils'
import { Upload, Play, ChevronDown, ChevronUp } from 'lucide-react'
import * as XLSX from 'xlsx'
import type { SpendRecordIn } from '../api/types'

const REQUIRED_COLS = ['vendor', 'amount', 'currency', 'department', 'category', 'transaction_date']

function parseFile(file: File): Promise<SpendRecordIn[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(data as string)
          resolve(Array.isArray(parsed) ? parsed : [parsed])
        } else {
          const wb = XLSX.read(data, { type: 'binary' })
          const ws = wb.Sheets[wb.SheetNames[0]]
          resolve(XLSX.utils.sheet_to_json<SpendRecordIn>(ws))
        }
      } catch { reject(new Error('Parse failed')) }
    }
    reader.onerror = reject
    if (file.name.endsWith('.json')) reader.readAsText(file)
    else reader.readAsBinaryString(file)
  })
}

const btnPrimary = (disabled: boolean) => cn(
  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
  disabled ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-cs-blue text-white hover:bg-cs-blue/80'
)

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <span className="text-xs font-medium text-gray-400">{title}</span>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  )
}

function DemoPanel() {
  const [n, setN] = useState(86)
  const [seed, setSeed] = useState(42)
  const [includeAnomalies, setIncludeAnomalies] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const { mutate, isPending, isSuccess, isError, error, data, reset } = useIngestDemo()
  const { data: preview } = useSyntheticData({ n, seed, include_anomalies: includeAnomalies }, showPreview)

  return (
    <SectionCard title="Demo Run">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <p className="text-[10px] text-gray-600 mb-1">Records</p>
          <input type="number" min={1} max={500} value={n} onChange={e => { setN(Number(e.target.value)); reset() }}
            className="w-20 bg-bg border border-border rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-cs-blue" />
        </div>
        <div>
          <p className="text-[10px] text-gray-600 mb-1">Seed</p>
          <input type="number" value={seed} onChange={e => { setSeed(Number(e.target.value)); reset() }}
            className="w-20 bg-bg border border-border rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-cs-blue" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer pb-0.5">
          <input type="checkbox" checked={includeAnomalies} onChange={e => { setIncludeAnomalies(e.target.checked); reset() }}
            className="accent-cs-blue w-4 h-4" />
          <span className="text-xs text-gray-400">Include anomalies</span>
        </label>
      </div>

      {isSuccess && data && <Banner variant="success" message={`Started · Process ${data.process_id.slice(0, 8)}… · ${data.records} records`} />}
      {isError && <Banner variant="error" message={(error as Error)?.message ?? 'Failed'} />}

      <div className="flex gap-2">
        <button onClick={() => mutate({ n, seed, include_anomalies: includeAnomalies })} disabled={isPending} className={btnPrimary(isPending)}>
          <Play className="w-4 h-4" />
          {isPending ? 'Running…' : 'Run Pipeline'}
        </button>
        <button onClick={() => setShowPreview(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs text-gray-400 hover:text-white transition-colors">
          Preview {showPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showPreview && preview && preview.records.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {Object.keys(preview.records[0]).slice(0, 7).map(k => (
                  <th key={k} className="text-left px-3 py-2 text-gray-600 font-medium whitespace-nowrap">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.records.slice(0, 8).map((row, i) => (
                <tr key={i} className="border-b border-border/40">
                  {Object.values(row).slice(0, 7).map((v, j) => (
                    <td key={j} className="px-3 py-1.5 text-gray-400 whitespace-nowrap">{String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-gray-700 px-3 py-1.5">{preview.count} total records</p>
        </div>
      )}
    </SectionCard>
  )
}

function BatchUploadPanel() {
  const [records, setRecords] = useState<SpendRecordIn[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const { mutate, isPending, isSuccess, isError, error, data, reset } = useIngestBatch()

  const onDrop = useCallback(async (accepted: File[]) => {
    setParseError(null); setRecords([]); reset()
    if (!accepted.length) return
    try {
      const parsed = await parseFile(accepted[0])
      const missing = REQUIRED_COLS.filter(c => !Object.keys(parsed[0] ?? {}).includes(c))
      if (missing.length) { setParseError(`Missing: ${missing.join(', ')}`); return }
      setRecords(parsed)
    } catch { setParseError('Could not parse file — ensure it is CSV, XLSX, or JSON.') }
  }, [reset])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  })

  return (
    <SectionCard title="Upload File">
      <div {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-cs-blue bg-cs-blue/5' : 'border-border hover:border-gray-500',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-7 h-7 text-gray-700 mx-auto mb-2" />
        <p className="text-sm text-gray-500">{isDragActive ? 'Drop here' : 'Drop file or click to browse'}</p>
        <p className="text-[10px] text-gray-700 mt-1">CSV · XLSX · JSON</p>
      </div>

      {parseError && <Banner variant="error" message={parseError} />}

      {records.length > 0 && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {REQUIRED_COLS.map(c => (
                    <th key={c} className="text-left px-3 py-2 text-gray-600 font-medium whitespace-nowrap">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-b border-border/40">
                    {REQUIRED_COLS.map(c => (
                      <td key={c} className="px-3 py-1.5 text-gray-400 whitespace-nowrap">
                        {String((r as unknown as Record<string, unknown>)[c] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-gray-700 px-3 py-1.5">{records.length} records</p>
          </div>

          {isSuccess && data && <Banner variant="success" message={`Ingested · Process ${data.process_id.slice(0, 8)}… · ${data.records_submitted} records`} />}
          {isError && <Banner variant="error" message={(error as Error)?.message ?? 'Upload failed'} />}

          <button onClick={() => mutate(records)} disabled={isPending}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              isPending ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-cs-green text-white hover:bg-cs-green/80',
            )}
          >
            <Upload className="w-4 h-4" />
            {isPending ? 'Uploading…' : `Ingest ${records.length} Records`}
          </button>
        </div>
      )}
    </SectionCard>
  )
}

export default function Ingest() {
  return (
    <div className="space-y-4 max-w-3xl">
      <h2 className="text-base font-semibold text-white">Ingest</h2>
      <DemoPanel />
      <BatchUploadPanel />
    </div>
  )
}
