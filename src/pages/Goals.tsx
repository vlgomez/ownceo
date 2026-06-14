import { useState, useEffect, useMemo, type FormEvent } from 'react'
import {
  Plus, Trash2, Target, Shield, Home, TrendingUp,
  CreditCard, MapPin, Star, CheckCircle2, AlertTriangle,
  CalendarDays, X, Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getGoals, createGoal, deleteGoal, computeProgress } from '../services/goals'
import type { Goal, GoalType, GoalInput } from '../services/goals'
import LoadingScreen from '../components/shared/LoadingScreen'

// ── goal type config ──────────────────────────────────────────────────────

const GOAL_CFG: Record<GoalType, {
  Icon: LucideIcon
  label: string
  accentClass: string
  bgClass: string
  borderClass: string
  barColor: string
}> = {
  emergency_fund: { Icon: Shield,    label: 'Fondo de emergencia', accentClass: 'text-violet-400',  bgClass: 'bg-violet-500/10',  borderClass: 'border-violet-500/30', barColor: '#8b5cf6' },
  house:          { Icon: Home,      label: 'Comprar casa',        accentClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/30',barColor: '#10b981' },
  investment:     { Icon: TrendingUp,label: 'Inversión',           accentClass: 'text-blue-400',    bgClass: 'bg-blue-500/10',    borderClass: 'border-blue-500/30',   barColor: '#3b82f6' },
  debt:           { Icon: CreditCard,label: 'Pagar deuda',         accentClass: 'text-amber-400',   bgClass: 'bg-amber-500/10',   borderClass: 'border-amber-500/30',  barColor: '#f59e0b' },
  travel:         { Icon: MapPin,    label: 'Viaje',               accentClass: 'text-pink-400',    bgClass: 'bg-pink-500/10',    borderClass: 'border-pink-500/30',   barColor: '#ec4899' },
  custom:         { Icon: Star,      label: 'Personalizado',       accentClass: 'text-cyan-400',    bgClass: 'bg-cyan-500/10',    borderClass: 'border-cyan-500/30',   barColor: '#06b6d4' },
}

const GOAL_TYPES: GoalType[] = ['emergency_fund', 'house', 'investment', 'debt', 'travel', 'custom']

// ── helpers ───────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
  return `€${Math.abs(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
}

function fmtMonths(n: number): string {
  if (!isFinite(n)) return '—'
  if (n === 0) return 'Ya alcanzado'
  const y = Math.floor(n / 12)
  const m = n % 12
  if (y === 0) return `${m} ${m === 1 ? 'mes' : 'meses'}`
  if (m === 0) return `${y} ${y === 1 ? 'año' : 'años'}`
  return `${y}a ${m}m`
}

const todayStr = new Date().toISOString().split('T')[0]

// ── GoalCard ─────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  onDelete,
  isDeleting,
}: {
  goal: Goal
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const cfg = GOAL_CFG[goal.type]
  const prog = computeProgress(goal)
  const { Icon } = cfg

  const targetDateFormatted = new Date(goal.targetDate).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-5 gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.bgClass} ${cfg.borderClass} border`}>
            <Icon size={16} className={cfg.accentClass} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-tight">{goal.name}</p>
            <p className={`mt-0.5 text-xs ${cfg.accentClass}`}>{cfg.label}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          disabled={isDeleting}
          aria-label="Eliminar objetivo"
          className="shrink-0 rounded-lg p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
        >
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-slate-400 tabular-nums">
            {fmtEur(goal.currentAmount)} <span className="text-slate-600">/ {fmtEur(goal.targetAmount)}</span>
          </span>
          <span className="font-semibold tabular-nums" style={{ color: cfg.barColor }}>
            {prog.progress}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${prog.progress}%`, backgroundColor: cfg.barColor }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-800/50 px-3 py-2.5">
          <p className="text-[10px] text-slate-500 mb-0.5">Restante</p>
          <p className="text-sm font-semibold text-white tabular-nums">{fmtEur(prog.remaining)}</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 px-3 py-2.5">
          <p className="text-[10px] text-slate-500 mb-0.5">Meses necesarios</p>
          <p className="text-sm font-semibold text-white tabular-nums">{fmtMonths(prog.monthsNeeded)}</p>
        </div>
      </div>

      {/* Date + on-track */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays size={12} />
          <span>{targetDateFormatted}</span>
          <span className="text-slate-700">·</span>
          <span>{fmtMonths(prog.monthsLeft)} restantes</span>
        </div>
        {goal.monthlyContribution > 0 ? (
          prog.onTrack ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
              <CheckCircle2 size={10} /> A tiempo
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
              <AlertTriangle size={10} /> Ajustar plan
            </span>
          )
        ) : (
          <span className="text-xs text-slate-600">Sin aportación</span>
        )}
      </div>
    </div>
  )
}

// ── form state ────────────────────────────────────────────────────────────

interface FormState {
  name: string
  type: GoalType
  targetAmount: string
  currentAmount: string
  targetDate: string
  monthlyContribution: string
}

const EMPTY_FORM: FormState = {
  name: '',
  type: 'custom',
  targetAmount: '',
  currentAmount: '0',
  targetDate: '',
  monthlyContribution: '',
}

// ── page ─────────────────────────────────────────────────────────────────

export default function Goals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getGoals(user.id)
      .then(setGoals)
      .finally(() => setLoading(false))
  }, [user])

  // Live preview while filling the form
  const formPreview = useMemo(() => {
    const target = parseFloat(form.targetAmount)
    const current = parseFloat(form.currentAmount) || 0
    const monthly = parseFloat(form.monthlyContribution) || 0
    if (isNaN(target) || target <= 0 || !form.targetDate) return null

    const remaining = Math.max(0, target - current)
    const progress = Math.min(100, Math.round((current / target) * 100))
    const now = new Date()
    const targetDate = new Date(form.targetDate)
    const monthsLeft = Math.max(
      0,
      (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()),
    )
    const monthsNeeded = monthly > 0 ? Math.ceil(remaining / monthly) : Infinity
    const onTrack = remaining === 0 || (isFinite(monthsNeeded) && monthsNeeded <= monthsLeft)
    return { progress, remaining, monthsLeft, monthsNeeded, onTrack, hasMonthly: monthly > 0 }
  }, [form])

  function openForm() {
    setForm(EMPTY_FORM)
    setFormError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setFormError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return

    const target = parseFloat(form.targetAmount)
    const current = parseFloat(form.currentAmount) || 0
    const monthly = parseFloat(form.monthlyContribution) || 0

    if (!form.name.trim()) { setFormError('El nombre es obligatorio.'); return }
    if (isNaN(target) || target <= 0) { setFormError('La cantidad objetivo debe ser mayor que 0.'); return }
    if (current < 0) { setFormError('El progreso actual no puede ser negativo.'); return }
    if (current > target) { setFormError('El progreso actual no puede superar el objetivo.'); return }
    if (!form.targetDate || form.targetDate <= todayStr) { setFormError('La fecha objetivo debe ser una fecha futura.'); return }
    if (monthly < 0) { setFormError('La aportación mensual no puede ser negativa.'); return }

    const input: GoalInput = {
      name:                form.name.trim(),
      type:                form.type,
      targetAmount:        target,
      currentAmount:       current,
      targetDate:          form.targetDate,
      monthlyContribution: monthly,
    }

    setSaving(true)
    const created = await createGoal(input, user.id)
    setSaving(false)

    if (!created) { setFormError('Error al guardar. Comprueba la conexión e inténtalo de nuevo.'); return }
    setGoals(prev => [created, ...prev])
    closeForm()
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await deleteGoal(id)
    setGoals(prev => prev.filter(g => g.id !== id))
    setDeletingId(null)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Objetivos financieros</h1>
          <p className="mt-1 text-sm text-slate-400">
            Define y traquea tus metas económicas
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openForm}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            <Plus size={16} />
            Nuevo objetivo
          </button>
        )}
      </div>

      {/* ── Create form ── */}
      {showForm && (
        <div className="rounded-2xl border border-violet-500/25 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold text-white">Nuevo objetivo</h2>
            <button
              onClick={closeForm}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nombre del objetivo
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormError('') }}
                placeholder="Ej: Fondo de emergencia 6 meses"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Type selector */}
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Tipo</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {GOAL_TYPES.map(t => {
                  const c = GOAL_CFG[t]
                  const { Icon: TypeIcon } = c
                  const isSelected = form.type === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                        isSelected
                          ? `${c.bgClass} ${c.borderClass} ${c.accentClass} font-medium`
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      <TypeIcon size={15} />
                      {c.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Amounts row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Cantidad objetivo (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={form.targetAmount}
                    onChange={e => { setForm(f => ({ ...f, targetAmount: e.target.value })); setFormError('') }}
                    placeholder="10000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-8 pr-4 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ya tengo ahorrado (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={form.currentAmount}
                    onChange={e => { setForm(f => ({ ...f, currentAmount: e.target.value })); setFormError('') }}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-8 pr-4 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Date + contribution */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fecha objetivo
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={form.targetDate}
                  onChange={e => { setForm(f => ({ ...f, targetDate: e.target.value })); setFormError('') }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Aportación mensual (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={form.monthlyContribution}
                    onChange={e => { setForm(f => ({ ...f, monthlyContribution: e.target.value })); setFormError('') }}
                    placeholder="200"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-8 pr-4 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Live preview */}
            {formPreview && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vista previa del objetivo
                </p>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${formPreview.progress}%`, backgroundColor: GOAL_CFG[form.type].barColor }}
                  />
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Progreso </span>
                    <span className="font-semibold text-white">{formPreview.progress}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Restante </span>
                    <span className="font-semibold text-white">{fmtEur(formPreview.remaining)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Tiempo restante </span>
                    <span className="font-semibold text-white">{fmtMonths(formPreview.monthsLeft)}</span>
                  </div>
                  {formPreview.hasMonthly && (
                    <>
                      <div>
                        <span className="text-slate-500">Meses necesarios </span>
                        <span className="font-semibold text-white">{fmtMonths(formPreview.monthsNeeded)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {formPreview.onTrack ? (
                          <>
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            <span className="font-semibold text-emerald-400">Llegarás a tiempo</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={11} className="text-amber-400" />
                            <span className="font-semibold text-amber-400">Necesitas más aportación</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {formError && (
              <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {formError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {saving ? 'Guardando…' : 'Crear objetivo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Goals list ── */}
      {goals.length === 0 && !showForm ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Target size={48} className="mb-4 text-slate-700" />
          <h2 className="text-xl font-semibold text-white">Sin objetivos todavía</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Define tu primer objetivo financiero y empieza a trackearlo mes a mes.
          </p>
          <button
            onClick={openForm}
            className="mt-6 flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            <Plus size={16} />
            Crear mi primer objetivo
          </button>
        </div>
      ) : (
        goals.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {goals.map(g => (
              <GoalCard
                key={g.id}
                goal={g}
                onDelete={handleDelete}
                isDeleting={deletingId === g.id}
              />
            ))}
          </div>
        )
      )}

      {/* ── Summary row ── */}
      {goals.length >= 2 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="mb-4 text-sm font-semibold text-white">Resumen de objetivos</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">{goals.length}</p>
              <p className="mt-0.5 text-xs text-slate-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                {goals.filter(g => computeProgress(g).progress === 100).length}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Completados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-400 tabular-nums">
                {goals.filter(g => { const p = computeProgress(g); return p.onTrack && p.progress < 100 }).length}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">A tiempo</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">
                {fmtEur(goals.reduce((sum, g) => sum + g.targetAmount, 0))}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Total objetivo</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
