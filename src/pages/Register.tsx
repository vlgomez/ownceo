import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { signUp, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // If Supabase auto-confirms the account (no email verification), redirect immediately
  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard', { replace: true })
  }, [user, authLoading, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres'); return }
    setError('')
    setSubmitting(true)
    const err = await signUp(email, password)
    setSubmitting(false)
    if (err) setError(err)
    else setSuccess(true)
    // If Supabase auto-logs the user in, useEffect above handles the redirect
  }

  // ── Success state (email confirmation required) ──────────────────────────
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 size={56} className="mx-auto mb-6 text-emerald-400" />
          <p className="text-2xl font-bold text-white">¡Cuenta creada!</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Hemos enviado un email de confirmación a{' '}
            <span className="font-medium text-slate-200">{email}</span>.
            <br />
            Revisa tu bandeja de entrada y confirma tu cuenta para continuar.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-white">
            Own<span className="text-violet-500">CEO</span>
          </Link>
          <p className="mt-4 text-xl font-semibold text-white">Crea tu cuenta gratuita</p>
          <p className="mt-1 text-sm text-slate-400">Empieza tu diagnóstico financiero hoy</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 transition-colors focus:border-violet-500 focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-slate-300">
                Confirmar contraseña
              </label>
              <input
                id="reg-confirm"
                type={showPwd ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-violet-500 focus:outline-none"
                placeholder="Repite tu contraseña"
              />
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
              {submitting ? 'Creando cuenta…' : 'Crear cuenta gratis'}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              Iniciar sesión
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
