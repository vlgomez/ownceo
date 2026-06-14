import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2, Clock, AlertTriangle, RefreshCw,
  TrendingUp, ShoppingCart, PiggyBank, BarChart2,
} from 'lucide-react'
import { useDiagnosticResult } from '../hooks/useDiagnosticResult'
import { buildPlan } from '../utils/planEngine'
import EmptyDashboard from '../components/dashboard/EmptyDashboard'
import WealthProjection from '../components/shared/WealthProjection'
import type { FinancialGoal, RoadmapMonth } from '../utils/planEngine'
import type { ProfileType } from '../types/diagnostic'

// ─── static config ───────────────────────────────────────────────────────────

const PROFILE_CFG: Record<ProfileType, { emoji: string; badge: string; bar: string }> = {
  Impulsivo: { emoji: '🔥', badge: 'bg-red-500/20 text-red-400',     bar: 'bg-red-500' },
  Ahorrador: { emoji: '🏦', badge: 'bg-blue-500/20 text-blue-400',   bar: 'bg-blue-500' },
  Estratega: { emoji: '🎯', badge: 'bg-violet-500/20 text-violet-400', bar: 'bg-violet-500' },
  Inversor:  { emoji: '📈', badge: 'bg-emerald-500/20 text-emerald-400', bar: 'bg-emerald-500' },
}

const STATUS_CFG = {
  achieved:   { label: 'Alcanzado',    Icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/12', bar: 'bg-emerald-500' },
  close:      { label: 'En progreso',  Icon: Clock,        color: 'text-violet-400',  bg: 'bg-violet-500/12',  bar: 'bg-violet-500' },
  needs_work: { label: 'Por trabajar', Icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/12',   bar: 'bg-amber-500' },
}

const PRIORITY_DOT: Record<'high' | 'medium' | 'low', string> = {
  high:   'bg-violet-500',
  medium: 'bg-slate-500',
  low:    'bg-slate-700',
}

function fmtEur(n: number): string {
  return `€${Math.abs(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
}

function progressColor(p: number): string {
  if (p >= 70) return 'bg-emerald-500'
  if (p >= 40) return 'bg-violet-500'
  return 'bg-amber-500'
}

// ─── sub-components ──────────────────────────────────────────────────────────

function GoalCard({ goal }: { goal: FinancialGoal }) {
  const s = STATUS_CFG[goal.status]
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white text-sm">{goal.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{goal.description}</p>
        </div>
        <span className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.color}`}>
          <s.Icon size={11} />
          {s.label}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span className="tabular-nums font-medium text-slate-200">{goal.currentLabel}</span>
          <span className="text-slate-500">obj. {goal.targetLabel}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className={`h-2 rounded-full ${s.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs">
          <span className={`tabular-nums font-semibold ${s.color}`}>{goal.progress}%</span>
          <span className="text-slate-600">100%</span>
        </div>
      </div>

      {/* Action */}
      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
        💡 {goal.actionText}
      </p>
    </div>
  )
}

function RoadmapCard({ month }: { month: RoadmapMonth }) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-4 ${month.headerClass}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${month.badgeClass}`}>
          {month.month}
        </span>
        <div>
          <p className="font-semibold text-white text-sm">{month.title}</p>
          <p className="text-xs text-slate-400">{month.theme}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {month.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            <span className="leading-snug">{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function Plan() {
  const { result } = useDiagnosticResult()

  if (!result) return <EmptyDashboard />

  const plan = buildPlan(result)
  const cfg = PROFILE_CFG[result.profile]
  const { financialData, savingsRate, expenseRatio, investmentRate, healthScore, profile, completedAt } = result
  const { income, fixedExpenses, variableExpenses, monthlySavings, monthlyInvestment } = financialData
  const totalExpenses = fixedExpenses + variableExpenses

  const date = new Date(completedAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const summaryItems = [
    { icon: TrendingUp,  label: 'Ingresos',    value: fmtEur(income),        sub: 'netos/mes', good: true },
    { icon: ShoppingCart, label: 'Gastos',     value: fmtEur(totalExpenses), sub: `ratio ${expenseRatio.toFixed(0)}%`, good: expenseRatio <= 70 },
    { icon: PiggyBank,   label: 'Ahorro',      value: fmtEur(monthlySavings), sub: `${savingsRate.toFixed(1)}%/mes`, good: savingsRate >= 20 },
    { icon: BarChart2,   label: 'Inversión',   value: fmtEur(monthlyInvestment), sub: `${investmentRate.toFixed(1)}%/mes`, good: investmentRate >= 10 },
  ]

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tu plan financiero</h1>
          <p className="mt-1 text-sm text-slate-400">
            Basado en tu diagnóstico del {date}
          </p>
        </div>
        <Link
          to="/diagnostico"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors sm:flex"
        >
          <RefreshCw size={14} />
          Actualizar diagnóstico
        </Link>
      </div>

      {/* ── Resumen actual ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Resumen actual</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Profile + health */}
          <div className="sm:col-span-2 lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{cfg.emoji}</span>
              <div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                  Perfil {profile}
                </span>
                <p className="mt-0.5 text-xs text-slate-500">Salud financiera</p>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">
                {healthScore}<span className="text-sm font-normal text-slate-500"> / 100</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className={`h-1.5 rounded-full ${cfg.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* 4 stat items */}
          {summaryItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.label}</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800">
                  <item.icon size={14} className="text-violet-400" />
                </div>
              </div>
              <p className="text-xl font-bold text-white tabular-nums">{item.value}</p>
              <p className={`mt-0.5 text-xs tabular-nums ${item.good ? 'text-emerald-400' : 'text-amber-400'}`}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Progreso visual ── */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Progreso hacia tus objetivos</h2>
            <p className="mt-0.5 text-sm text-slate-400">
              {plan.achievedCount} de {plan.goals.length} objetivos financieros alcanzados
            </p>
          </div>
          <p className="text-4xl font-bold text-white tabular-nums shrink-0">
            {plan.overallProgress}
            <span className="text-xl font-normal text-slate-500">%</span>
          </p>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className={`h-3 rounded-full ${progressColor(plan.overallProgress)}`}
            initial={{ width: 0 }}
            animate={{ width: `${plan.overallProgress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
        <div className="mt-3 flex gap-6">
          {plan.goals.map((g) => {
            const s = STATUS_CFG[g.status]
            return (
              <div key={g.id} className="flex items-center gap-1.5 text-xs">
                <span className={`h-2 w-2 rounded-full ${s.bar}`} />
                <span className="text-slate-400">{g.title}</span>
                <span className={`font-semibold tabular-nums ${s.color}`}>{g.progress}%</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Objetivos automáticos ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Objetivos automáticos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {plan.goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      </section>

      {/* ── Roadmap 90 días ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Roadmap · Próximos 90 días
          </h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
            Perfil {profile}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.roadmap.map((month) => (
            <RoadmapCard key={month.month} month={month} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          · Punto violeta = prioridad alta &nbsp;· Punto gris = prioridad media/baja
        </p>
      </section>

      {/* ── Proyección patrimonial ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Proyección patrimonial
        </h2>
        <WealthProjection
          monthlySavings={monthlySavings}
          monthlyInvestment={monthlyInvestment}
        />
      </section>

      {/* ── CTA ── */}
      <section className="rounded-2xl border border-violet-500/25 bg-violet-600/8 p-8 text-center">
        <h2 className="text-lg font-bold text-white">¿Han cambiado tus finanzas?</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Actualiza tu diagnóstico cuando cambien tus ingresos, gastos o metas. Tu plan se regenerará automáticamente.
        </p>
        <Link
          to="/diagnostico"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          <RefreshCw size={16} />
          Actualizar mi plan
        </Link>
      </section>
    </div>
  )
}
