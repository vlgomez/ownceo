import { Link } from 'react-router-dom'
import {
  TrendingUp, ShoppingCart, PiggyBank, BarChart2,
  Wallet, CreditCard, ArrowUpRight, MessageSquare, ClipboardList,
} from 'lucide-react'
import { useDiagnosticResult } from '../hooks/useDiagnosticResult'
import StatCard from '../components/dashboard/StatCard'
import HealthScoreCard from '../components/dashboard/HealthScoreCard'
import RatioBar from '../components/dashboard/RatioBar'
import EmptyDashboard from '../components/dashboard/EmptyDashboard'
import WealthProjection from '../components/shared/WealthProjection'
import type { ProfileType } from '../types/diagnostic'

const MOCK_TRANSACTIONS = [
  { name: 'Spotify', category: 'Entretenimiento', amount: '-€9.99', date: 'Hoy', income: false },
  { name: 'Salario', category: 'Ingresos', amount: '+€2,125', date: 'Ayer', income: true },
  { name: 'Supermercado', category: 'Alimentación', amount: '-€87.50', date: '12 jun', income: false },
  { name: 'Netflix', category: 'Entretenimiento', amount: '-€15.99', date: '11 jun', income: false },
  { name: 'Freelance', category: 'Ingresos', amount: '+€500', date: '10 jun', income: true },
]

const PROFILE_BADGE: Record<ProfileType, string> = {
  Impulsivo: 'bg-red-500/20 text-red-400',
  Ahorrador: 'bg-blue-500/20 text-blue-400',
  Estratega: 'bg-violet-500/20 text-violet-400',
  Inversor:  'bg-emerald-500/20 text-emerald-400',
}

const PROFILE_GREETING: Record<ProfileType, string> = {
  Impulsivo: 'Pequeños pasos, grandes cambios. Sigues adelante.',
  Ahorrador: 'Es hora de hacer trabajar tu dinero.',
  Estratega: 'Vas por el buen camino. Sigue optimizando.',
  Inversor:  'Tu dinero trabaja para ti. Sigue escalando.',
}

function fmtEur(n: number): string {
  return `€${Math.abs(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
}

export default function Dashboard() {
  const { result } = useDiagnosticResult()

  if (!result) return <EmptyDashboard />

  const {
    financialData, savingsRate, expenseRatio,
    investmentRate, availableBalance, recommendations, profile,
  } = result
  const { income, fixedExpenses, variableExpenses, monthlySavings, monthlyInvestment, debt } = financialData
  const totalExpenses = fixedExpenses + variableExpenses

  const stats = [
    {
      label: 'Ingresos mensuales',
      value: fmtEur(income),
      change: 'Ingresos netos/mes',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      label: 'Gastos totales',
      value: fmtEur(totalExpenses),
      change: `Ratio: ${expenseRatio.toFixed(1)}% de ingresos`,
      trend: (expenseRatio <= 70 ? 'up' : 'down') as 'up' | 'down',
      icon: ShoppingCart,
    },
    {
      label: 'Ahorro mensual',
      value: fmtEur(monthlySavings),
      change: `Tasa: ${savingsRate.toFixed(1)}% · obj. ≥20%`,
      trend: (savingsRate >= 20 ? 'up' : 'down') as 'up' | 'down',
      icon: PiggyBank,
    },
    {
      label: 'Inversión mensual',
      value: fmtEur(monthlyInvestment),
      change: `Tasa: ${investmentRate.toFixed(1)}% · obj. ≥10%`,
      trend: (investmentRate >= 10 ? 'up' : 'down') as 'up' | 'down',
      icon: BarChart2,
    },
    {
      label: 'Balance libre',
      value: fmtEur(availableBalance),
      change: availableBalance >= 0 ? 'Excedente mensual' : '⚠ Déficit mensual',
      trend: (availableBalance >= 0 ? 'up' : 'down') as 'up' | 'down',
      icon: Wallet,
    },
    {
      label: 'Deuda total',
      value: fmtEur(debt),
      change: debt === 0 ? 'Sin deudas — excelente' : 'Capital pendiente',
      trend: (debt === 0 ? 'up' : 'down') as 'up' | 'down',
      icon: CreditCard,
    },
  ]

  const ratios = [
    {
      label: 'Tasa de ahorro',
      value: savingsRate,
      target: 'obj. ≥20%',
      isGood: savingsRate >= 20,
      colorClass: 'bg-violet-500',
    },
    {
      label: 'Tasa de inversión',
      value: investmentRate,
      target: 'obj. ≥10%',
      isGood: investmentRate >= 10,
      colorClass: 'bg-emerald-500',
    },
    {
      label: 'Ratio de gastos',
      value: expenseRatio,
      target: 'obj. ≤70%',
      isGood: expenseRatio <= 70,
      colorClass: 'bg-slate-400',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Buenos días</h1>
          <p className="mt-1 text-slate-400">{PROFILE_GREETING[profile]}</p>
        </div>
        <Link
          to="/diagnostico"
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors sm:flex"
        >
          <ClipboardList size={15} />
          Actualizar diagnóstico
        </Link>
      </div>

      {/* Health score */}
      <HealthScoreCard result={result} />

      {/* 6 stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Ratios + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 font-semibold text-white">Tus ratios financieros</h2>
          <div className="space-y-5">
            {ratios.map((r) => (
              <RatioBar key={r.label} {...r} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 font-semibold text-white">Acciones rápidas</h2>
          <div className="space-y-2.5">
            <Link
              to="/chat"
              className="flex w-full items-center justify-between rounded-lg border border-violet-500/30 bg-violet-600/10 p-3.5 text-sm text-violet-400 hover:bg-violet-600/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Hablar con el Asistente</span>
              </div>
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/diagnostico"
              className="flex w-full items-center justify-between rounded-lg border border-slate-700 p-3.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
            >
              <span>Actualizar diagnóstico</span>
              <ArrowUpRight size={16} />
            </Link>
            {['Añadir transacción', 'Ver reportes'].map((action) => (
              <button
                key={action}
                className="flex w-full items-center justify-between rounded-lg border border-slate-700 p-3.5 text-sm text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              >
                <span>{action}</span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-white">🎯 Recomendaciones personalizadas</h2>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${PROFILE_BADGE[profile]}`}>
            Perfil {profile}
          </span>
        </div>
        <ol className="space-y-4">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600/25 text-xs font-bold text-violet-400">
                {i + 1}
              </span>
              <span className="leading-relaxed text-slate-300">{rec}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Wealth projection */}
      <WealthProjection
        monthlySavings={monthlySavings}
        monthlyInvestment={monthlyInvestment}
      />

      {/* Mock transactions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Transacciones recientes</h2>
          <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-500">
            Datos de ejemplo
          </span>
        </div>
        <div className="space-y-1">
          {MOCK_TRANSACTIONS.map((t) => (
            <div
              key={`${t.name}-${t.date}`}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-slate-800/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">{t.name}</p>
                <p className="text-xs text-slate-500">{t.category} · {t.date}</p>
              </div>
              <span className={`text-sm font-medium ${t.income ? 'text-emerald-400' : 'text-slate-300'}`}>
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
