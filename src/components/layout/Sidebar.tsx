import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Upload, GitBranch, AlertTriangle, FileText, BarChart3 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { usePendingApproval } from '../../hooks/usePendingApproval'

const navItems = [
  { to: '/',          label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/ingest',    label: 'Data Ingest', icon: Upload },
  { to: '/pipeline',  label: 'Pipeline',   icon: GitBranch },
  { to: '/anomalies', label: 'Anomalies',  icon: AlertTriangle, badge: true },
  { to: '/logs',      label: 'Logs',       icon: FileText },
  { to: '/summary',   label: 'Summary',    icon: BarChart3 },
]

export function Sidebar() {
  const { data: pending } = usePendingApproval()
  const pendingCount = pending?.count ?? 0

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-card border-r border-border h-screen fixed left-0 top-0">
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-cs-blue flex items-center justify-center text-xs font-bold text-white">CS</div>
          <span className="text-sm font-bold text-white">CostSense AI</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5 ml-9">Cost Intelligence Platform</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-cs-blue/20 text-cs-blue font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && pendingCount > 0 && (
              <span className="bg-cs-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-gray-600">v1.0 · Multi-Agent AI</p>
      </div>
    </aside>
  )
}
