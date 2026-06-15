import type { DiagnosticResult } from '../types/diagnostic'
import type { AdvisorAnalysis } from '../types/advisor'
import type { Goal } from './goals'

interface AdvisorPayload {
  mode: 'analysis' | 'chat'
  diagnosticResult: DiagnosticResult | null
  goals: Goal[]
  history: DiagnosticResult[]
  messages?: { role: 'user' | 'assistant'; content: string }[]
}

async function callAdvisor(payload: AdvisorPayload) {
  const res = await fetch('/api/advisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as any).error ?? res.statusText)
  }
  return res.json()
}

export async function generateAdvisorAnalysis(
  diagnosticResult: DiagnosticResult,
  goals: Goal[],
  history: DiagnosticResult[],
): Promise<AdvisorAnalysis | null> {
  try {
    const json = await callAdvisor({ mode: 'analysis', diagnosticResult, goals, history })
    if (json.type === 'analysis') return json.data as AdvisorAnalysis
    return null
  } catch {
    return null
  }
}

export async function chatWithAdvisor(
  messages: { role: 'user' | 'assistant'; content: string }[],
  diagnosticResult: DiagnosticResult | null,
  goals: Goal[],
  history: DiagnosticResult[],
): Promise<string | null> {
  try {
    const json = await callAdvisor({ mode: 'chat', diagnosticResult, goals, history, messages })
    return (json.content as string) ?? null
  } catch {
    return null
  }
}
