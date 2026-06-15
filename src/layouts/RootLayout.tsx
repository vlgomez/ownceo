import { useState } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold text-white">
            Own<span className="text-violet-500">CEO</span>
          </Link>

          {/* Desktop nav */}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/dashboard"
              className="hidden text-sm text-slate-400 transition-colors hover:text-white sm:block"
            >
              Entrar
            </Link>
            <Link
              to="/diagnostico"
              className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 sm:px-4"
            >
              Diagnóstico gratis
            </Link>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 md:hidden"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/pricing"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                Precios
              </NavLink>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-white"
              >
                Entrar
              </Link>
            </div>
          </div>
        )}
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
