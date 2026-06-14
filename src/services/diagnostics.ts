import { supabase } from './supabase'
import type { DiagnosticResult, FinancialData, ProfileType } from '../types/diagnostic'

/*
 * Required table — run once in the Supabase SQL editor:
 *
 * CREATE TABLE diagnostics (
 *   id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   test_score   integer      NOT NULL,
 *   health_score numeric(5,2) NOT NULL,
 *   profile      text         NOT NULL,
 *   financial_data jsonb      NOT NULL,
 *   savings_rate   numeric(5,2) NOT NULL,
 *   expense_ratio  numeric(5,2) NOT NULL,
 *   investment_rate numeric(5,2) NOT NULL,
 *   available_balance numeric(12,2) NOT NULL,
 *   recommendations text[]     NOT NULL,
 *   completed_at timestamptz  NOT NULL,
 *   created_at   timestamptz  NOT NULL DEFAULT now()
 * );
 * ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "own_diagnostics" ON diagnostics
 *   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
 */

interface DiagnosticsRow {
  id: string
  user_id: string
  test_score: number
  health_score: number
  profile: string
  financial_data: unknown  // JSONB — cast to FinancialData on read
  savings_rate: number
  expense_ratio: number
  investment_rate: number
  available_balance: number
  recommendations: string[]
  completed_at: string
  created_at: string
}

function rowToResult(row: DiagnosticsRow): DiagnosticResult {
  return {
    testScore:        row.test_score,
    healthScore:      row.health_score,
    profile:          row.profile as ProfileType,
    financialData:    row.financial_data as FinancialData,
    savingsRate:      row.savings_rate,
    expenseRatio:     row.expense_ratio,
    investmentRate:   row.investment_rate,
    availableBalance: row.available_balance,
    recommendations:  row.recommendations,
    completedAt:      row.completed_at,
  }
}

// Insert a new diagnostic row for the given user.
export async function saveDiagnostic(result: DiagnosticResult, userId: string): Promise<void> {
  await supabase.from('diagnostics').insert({
    user_id:           userId,
    test_score:        result.testScore,
    health_score:      result.healthScore,
    profile:           result.profile,
    financial_data:    result.financialData,
    savings_rate:      result.savingsRate,
    expense_ratio:     result.expenseRatio,
    investment_rate:   result.investmentRate,
    available_balance: result.availableBalance,
    recommendations:   result.recommendations,
    completed_at:      result.completedAt,
  })
}

// Return all diagnostics for the user, oldest first.
export async function getAllDiagnostics(userId: string): Promise<DiagnosticResult[]> {
  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error || !data) return []
  return (data as DiagnosticsRow[]).map(rowToResult)
}

// Return the most recently saved diagnostic for the user, or null if none.
export async function getLatestDiagnostic(userId: string): Promise<DiagnosticResult | null> {
  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return rowToResult(data as DiagnosticsRow)
}
