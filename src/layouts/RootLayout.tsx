import { Outlet, Link, NavLink } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-white">
            Own<span className="text-violet-500">CEO</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
              }
            >
              Precios
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/diagnostico"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Diagnóstico gratis
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>© 2026 OwnCEO · Tu CFO personal con IA</p>
      </footer>
    </div>
  )
}
