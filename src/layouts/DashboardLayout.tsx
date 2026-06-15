import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, Map, Activity, Settings,
  LogOut, TrendingUp, History, Target, Menu, X,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/dashboard',            icon: LayoutDashboard, label: 'Dashboard',    shortLabel: 'Panel' },
  { to: '/plan',                 icon: Map,             label: 'Mi Plan',      shortLabel: 'Plan' },
  { to: '/history',              icon: History,         label: 'Historial',    shortLabel: 'Historial' },
  { to: '/goals',                icon: Target,          label: 'Objetivos',    shortLabel: 'Metas' },
  { to: '/investment-simulator', icon: Activity,        label: 'Simulador',    shortLabel: 'Simula' },
  { to: '/chat',                 icon: MessageSquare,   label: 'Asistente IA', shortLabel: 'IA' },
]

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const emailLabel = user?.email?.split('@')[0] ?? 'Usuario'
  const initial = (user?.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">

      {/* ── Sidebar (desktop only) ── */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900">
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
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 flex w-72 flex-col border-r border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <Link
                to="/"
                className="text-xl font-bold text-white"
                onClick={() => setSidebarOpen(false)}
              >
                Own<span className="text-violet-500">CEO</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
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

            <div className="border-t border-slate-800 p-4">
              <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{emailLabel}</p>
                  <p className="text-xs text-slate-500">Plan Gratis</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-800 bg-slate-900 px-4 py-3 md:px-8 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors md:hidden"
                aria-label="Abrir menú"
              >
                <Menu size={20} />
              </button>
              {/* Logo — mobile only */}
              <Link to="/" className="text-lg font-bold text-white md:hidden">
                Own<span className="text-violet-500">CEO</span>
              </Link>
              {/* Finanzas label — desktop only */}
              <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
                <TrendingUp size={16} className="text-violet-500" />
                <span>Finanzas Inteligentes</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-slate-100">{emailLabel}</p>
                <p className="text-xs text-slate-500">Plan Gratis</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {initial}
              </div>
            </div>
          </div>
        </header>

        {/* Extra pb on mobile to clear bottom nav */}
        <main className="flex-1 overflow-auto p-4 pb-24 sm:p-6 md:p-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom navigation (mobile only) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-900 md:hidden">
        <div className="grid h-16 grid-cols-6">
          {navItems.map(({ to, icon: Icon, shortLabel }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              <Icon size={19} />
              <span className="w-full truncate text-center text-[9px] font-medium leading-none px-0.5">
                {shortLabel}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
