import { Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Map, Activity, Settings, LogOut, TrendingUp } from 'lucide-react'

const navItems = [
  { to: '/dashboard',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/plan',                  icon: Map,             label: 'Mi Plan' },
  { to: '/investment-simulator',  icon: Activity,        label: 'Simulador' },
  { to: '/chat',                  icon: MessageSquare,   label: 'Asistente IA' },
]

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <Link to="/" className="text-xl font-bold text-white">
            Own<span className="text-violet-500">CEO</span>
          </Link>
          <p className="mt-1 text-xs text-slate-500">Panel de Control</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4 space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
            <Settings size={18} />
            Configuración
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <LogOut size={18} />
            Salir
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-800 bg-slate-900 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp size={16} className="text-violet-500" />
              <span>Finanzas Inteligentes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-100">Usuario</p>
                <p className="text-xs text-slate-500">Plan Gratis</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                U
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
