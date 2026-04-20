interface JsonViewerProps {
  data: unknown
  title?: string
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const json = JSON.stringify(data, null, 2)
  return (
    <div className="bg-bg rounded border border-border overflow-hidden">
      {title && (
        <div className="px-3 py-1.5 border-b border-border text-xs text-gray-400 font-medium">{title}</div>
      )}
      <pre className="text-xs font-mono p-3 overflow-auto max-h-72 text-gray-300 leading-relaxed whitespace-pre-wrap break-all">
        {json}
      </pre>
    </div>
  )
}
