import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import Dashboard from './pages/Dashboard'
import Anomalies from './pages/Anomalies'
import Logs from './pages/Logs'
import Summary from './pages/Summary'

const Ingest = lazy(() => import('./pages/Ingest'))
const Pipeline = lazy(() => import('./pages/Pipeline'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="ingest" element={<Suspense fallback={<LoadingSpinner />}><Ingest /></Suspense>} />
          <Route path="pipeline" element={<Suspense fallback={<LoadingSpinner />}><Pipeline /></Suspense>} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="logs" element={<Logs />} />
          <Route path="summary" element={<Summary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
