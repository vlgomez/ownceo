import { supabase } from './supabase'

/*
 * Required table — run once in Supabase SQL editor:
 *
 * CREATE TABLE financial_goals (
 *   id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   name                 text NOT NULL,
 *   type                 text NOT NULL,
 *   target_amount        numeric(12,2) NOT NULL,
 *   current_amount       numeric(12,2) NOT NULL DEFAULT 0,
 *   target_date          date NOT NULL,
 *   monthly_contribution numeric(12,2) NOT NULL DEFAULT 0,
 *   created_at           timestamptz NOT NULL DEFAULT now(),
 *   updated_at           timestamptz NOT NULL DEFAULT now()
 * );
 * ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "own_goals" ON financial_goals
 *   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
 */

export type GoalType = 'emergency_fund' | 'house' | 'investment' | 'debt' | 'travel' | 'custom'

export interface Goal {
  id: string
  name: string
  type: GoalType
  targetAmount: number
  currentAmount: number
  targetDate: string     // YYYY-MM-DD
  monthlyContribution: number
  createdAt: string
}

export interface GoalInput {
  name: string
  type: GoalType
  targetAmount: number
  currentAmount: number
  targetDate: string
  monthlyContribution: number
}

export interface GoalProgress {
  progress: number      // 0–100
  remaining: number
  monthsNeeded: number  // Infinity when no monthly contribution
  monthsLeft: number
  onTrack: boolean
}

export function computeProgress(goal: Goal): GoalProgress {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const progress = goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0

  const now = new Date()
  const target = new Date(goal.targetDate)
  const monthsLeft = Math.max(
    0,
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()),
  )

  const monthsNeeded = goal.monthlyContribution > 0
    ? Math.ceil(remaining / goal.monthlyContribution)
    : Infinity

  const onTrack = remaining === 0 || (isFinite(monthsNeeded) && monthsNeeded <= monthsLeft)

  return { progress, remaining, monthsNeeded, monthsLeft, onTrack }
}

// ── Supabase row mapping ────────────────────────────────────────────────────

interface GoalRow {
  id: string
  user_id: string
  name: string
  type: string
  target_amount: number
  current_amount: number
  target_date: string
  monthly_contribution: number
  created_at: string
  updated_at: string
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id:                  row.id,
    name:                row.name,
    type:                row.type as GoalType,
    targetAmount:        row.target_amount,
    currentAmount:       row.current_amount,
    targetDate:          row.target_date,
    monthlyContribution: row.monthly_contribution,
    createdAt:           row.created_at,
  }
}

export async function getGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as GoalRow[]).map(rowToGoal)
}

export async function createGoal(input: GoalInput, userId: string): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('financial_goals')
    .insert({
      user_id:             userId,
      name:                input.name,
      type:                input.type,
      target_amount:       input.targetAmount,
      current_amount:      input.currentAmount,
      target_date:         input.targetDate,
      monthly_contribution: input.monthlyContribution,
    })
    .select()
    .single()

  if (error || !data) return null
  return rowToGoal(data as GoalRow)
}

export async function deleteGoal(id: string): Promise<void> {
  await supabase.from('financial_goals').delete().eq('id', id)
}
