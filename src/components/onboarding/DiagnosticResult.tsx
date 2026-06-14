import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, RefreshCw, TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react'
import type { DiagnosticResult } from '../../types/diagnostic'

const PROFILE_CONFIG = {
  Impulsivo: {
    emoji: '🔥',
    border: 'border-red-500/30',
    bg: 'bg-red-500/8',
    badge: 'bg-red-500/20 text-red-400',
    bar: 'bg-red-500',
    description:
      'Tiendes a gastar sin control y sin un plan claro. La buena noticia: con pequeños hábitos puedes cambiar esto completamente en 90 días.',
  },
  Ahorrador: {
    emoji: '🏦',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/8',
    badge: 'bg-blue-500/20 text-blue-400',
    bar: 'bg-blue-500',
    description:
      'Tienes disciplina de ahorro, pero el dinero parado pierde valor. El siguiente paso es ponerlo a trabajar.',
  },
  Estratega: {
    emoji: '🎯',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/8',
    badge: 'bg-violet-500/20 text-violet-400',
    bar: 'bg-violet-500',
    description:
      'Tienes una base sólida: controlas tus gastos e inviertes. Ahora se trata de optimizar y acelerar tu plan.',
  },
  Inversor: {
    emoji: '📈',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/8',
    badge: 'bg-emerald-500/20 text-emerald-400',
    bar: 'bg-emerald-500',
    description:
      'Tu dinero trabaja activamente para ti. El reto es la optimización fiscal, la diversificación y la escalabilidad.',
  },
}

const healthLabel = (score: number) => {
  if (score >= 75) return 'Excelente — mejor que el 80% de personas en tu situación'
  if (score >= 55) return 'Bien — hay margen de mejora claro'
  if (score >= 35) return 'Regular — puedes mejorar significativamente en 6 meses'
  return 'Necesita atención — los cambios básicos tendrán un gran impacto'
}

interface Props {
  result: DiagnosticResult
  onReset: () => void
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
})

export default function DiagnosticResult({ result, onReset }: Props) {
  const cfg = PROFILE_CONFIG[result.profile]

  const metrics = [
    {
      label: 'Tasa de ahorro',
      value: `${result.savingsRate}%`,
      target: '≥ 20%',
      ok: result.savingsRate >= 20,
      icon: PiggyBank,
    },
    {
      label: 'Ratio de gastos',
      value: `${result.expenseRatio}%`,
      target: '≤ 70%',
      ok: result.expenseRatio <= 70,
      icon: TrendingDown,
    },
    {
      label: 'Tasa de inversión',
      value: `${result.investmentRate}%`,
      target: '≥ 10%',
      ok: result.investmentRate >= 10,
      icon: TrendingUp,
    },
    {
      label: 'Balance libre',
      value: `€${result.availableBalance}`,
      target: '> €0',
      ok: result.availableBalance >= 0,
      icon: Wallet,
    },
  ]

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Profile card */}
      <motion.div
        {...fade(0)}
        className={`rounded-2xl border p-6 text-center ${cfg.border} ${cfg.bg}`}
      >
        <div className="mb-3 text-5xl">{cfg.emoji}</div>
        <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}>
          Perfil: {result.profile}
        </span>
        <p className="text-sm leading-relaxed text-slate-400">{cfg.description}</p>
      </motion.div>

      {/* Health score */}
      <motion.div
        {...fade(0.08)}
        className="rounded-xl border border-slate-800 bg-slate-900 p-5"
      >
        <div className="mb-3 flex items-end justify-between">
          <span className="text-sm font-medium text-slate-300">Salud financiera</span>
          <span className="text-2xl font-bold text-white">
            {result.healthScore}
            <span className="text-base font-normal text-slate-500"> / 100</span>
          </span>
        </div>
        <div className="mb-2 h-3 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className={`h-3 rounded-full ${cfg.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${result.healthScore}%` }}
            transition={{ delay: 0.4, duration: 1.1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-slate-500">{healthLabel(result.healthScore)}</p>
      </motion.div>

      {/* Metrics grid */}
      <motion.div {...fade(0.16)} className="grid grid-cols-2 gap-3">
        {metrics.map(({ label, value, target, ok, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <Icon size={15} className={ok ? 'text-emerald-400' : 'text-amber-400'} />
              <span className={`text-xs ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                {target}
              </span>
            </div>
            <p className={`text-lg font-bold ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>
              {value}
            </p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Recommendations */}
      <motion.div
        {...fade(0.24)}
        className="rounded-xl border border-slate-800 bg-slate-900 p-5"
      >
        <h3 className="mb-4 font-semibold text-white">🎯 Tus 5 acciones prioritarias</h3>
        <ol className="space-y-3.5">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600/25 text-xs font-bold text-violet-400">
                {i + 1}
              </span>
              <span className="leading-relaxed text-slate-300">{rec}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* CTAs */}
      <motion.div {...fade(0.32)} className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/dashboard"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          Ver mi dashboard
          <ArrowRight size={18} />
        </Link>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-3.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw size={15} />
          Repetir diagnóstico
        </button>
      </motion.div>
    </div>
  )
}
