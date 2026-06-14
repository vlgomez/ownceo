import { useState } from 'react'
import type { DiagnosticResult } from '../types/diagnostic'

const STORAGE_KEY = 'ownceo_diagnostic_v1'

function readResult(): DiagnosticResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DiagnosticResult) : null
  } catch {
    return null
  }
}

export function useDiagnosticResult() {
  const [result] = useState<DiagnosticResult | null>(readResult)
  return { result }
}
