import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Return the user to whatever page they were trying to reach
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true })
  }, [user, authLoading, navigate, from])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const err = await signIn(email, password)
    setSubmitting(false)
    if (err) setError(err)
    // success → useEffect redirects when user state updates
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Own<span className="text-violet-500">CEO</span>
          </Link>
          <p className="mt-4 text-xl font-semibold text-white">Bienvenido de vuelta</p>
          <p className="mt-1 text-sm text-slate-400">Inicia sesión en tu cuenta</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-violet-500 focus:outline-none"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 transition-colors focus:border-violet-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              Crear cuenta gratis
            </Link>
          </p>
        </div>

        {/* Back */}
        <p className="mt-6 text-center text-sm text-slate-700">
          <Link to="/" className="transition-colors hover:text-slate-400">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
