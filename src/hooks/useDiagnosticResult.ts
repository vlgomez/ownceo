import { useState, useEffect } from 'react'
import type { DiagnosticResult } from '../types/diagnostic'
import { useAuth } from './useAuth'
import { getLatestDiagnostic } from '../services/diagnostics'

const STORAGE_KEY = 'ownceo_diagnostic_v1'

function readLocal(): DiagnosticResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DiagnosticResult) : null
  } catch {
    return null
  }
}

export function useDiagnosticResult() {
  const { user, loading: authLoading } = useAuth()
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    async function load() {
      if (user) {
        try {
          const remote = await getLatestDiagnostic(user.id)
          if (remote) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remote))
            setResult(remote)
            return
          }
        } catch {
          // Supabase unavailable — fall through to localStorage
        }
      }
      setResult(readLocal())
    }

    load().finally(() => setLoading(false))
  }, [user, authLoading])

  return { result, loading }
}
