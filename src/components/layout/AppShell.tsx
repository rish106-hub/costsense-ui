import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const titles: Record<string, string> = {
  '/':          'Dashboard',
  '/ingest':    'Data Ingestion',
  '/pipeline':  'Live Pipeline Monitor',
  '/anomalies': 'Anomaly Management',
  '/logs':      'Process Logs',
  '/summary':   'Executive Summary',
}

export function AppShell() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'CostSense AI'

  return (
    <div className="flex min-h-screen bg-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-56 min-h-screen">
        <TopBar title={title} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
