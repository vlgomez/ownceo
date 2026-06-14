import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

// ─── types ───────────────────────────────────────────────────────────────────

interface AuthCtx {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

// ─── context ─────────────────────────────────────────────────────────────────

const Ctx = createContext<AuthCtx | null>(null)

// ─── provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage on mount
    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null))
      .catch(() => {/* Supabase not configured or network unavailable */})
      .finally(() => setLoading(false))

    // Keep in sync with Supabase auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? toSpanish(error.message) : null
  }

  async function signUp(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signUp({ email, password })
    return error ? toSpanish(error.message) : null
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
    // onAuthStateChange fires automatically → user becomes null → ProtectedRoute redirects
  }

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ─── error translation ───────────────────────────────────────────────────────

function toSpanish(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid email or password'))
    return 'Email o contraseña incorrectos'
  if (m.includes('email not confirmed'))
    return 'Confirma tu email antes de iniciar sesión'
  if (m.includes('already registered'))
    return 'Este email ya tiene una cuenta registrada'
  if (m.includes('password should be at least'))
    return 'La contraseña debe tener mínimo 6 caracteres'
  if (m.includes('unable to validate email'))
    return 'Dirección de email inválida'
  if (m.includes('signup is disabled'))
    return 'El registro está temporalmente desactivado'
  return 'Ha ocurrido un error. Inténtalo de nuevo.'
}
