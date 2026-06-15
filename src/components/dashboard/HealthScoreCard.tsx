import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { DiagnosticResult } from '../../types/diagnostic'

const PROFILE_CFG = {
  Impulsivo: { emoji: '🔥', badge: 'bg-red-500/20 text-red-400', bar: 'bg-red-500' },
  Ahorrador: { emoji: '🏦', badge: 'bg-blue-500/20 text-blue-400', bar: 'bg-blue-500' },
  Estratega: { emoji: '🎯', badge: 'bg-violet-500/20 text-violet-400', bar: 'bg-violet-500' },
  Inversor:  { emoji: '📈', badge: 'bg-emerald-500/20 text-emerald-400', bar: 'bg-emerald-500' },
}

const healthLabel = (s: number) => {
  if (s >= 75) return `Excelente — mejor que el ${Math.round(s * 0.82)}% de personas`
  if (s >= 55) return 'Bien — hay margen de mejora claro'
  if (s >= 35) return 'Regular — puedes mejorar significativamente en 6 meses'
  return 'Necesita atención — los cambios básicos tienen mucho impacto'
}

interface Props { result: DiagnosticResult }

export default function HealthScoreCard({ result }: Props) {
  const cfg = PROFILE_CFG[result.profile]
  const date = new Date(result.completedAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4 sm:mb-6">
        {/* Profile info */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{cfg.emoji}</span>
          <div>
            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${cfg.badge}`}>
              Perfil: {result.profile}
            </span>
            <p className="mt-1 text-xs text-slate-500">Diagnóstico del {date}</p>
          </div>
        </div>
        <Link
          to="/diagnostico"
          className="shrink-0 text-xs text-slate-600 hover:text-violet-400 transition-colors"
        >
          Actualizar →
        </Link>
      </div>

      {/* Score */}
      <div className="flex items-end justify-between mb-3">
        <span className="text-sm font-medium text-slate-300">Salud financiera</span>
        <span className="text-4xl font-bold text-white tabular-nums">
          {result.healthScore}
          <span className="text-xl font-normal text-slate-500"> / 100</span>
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className={`h-3 rounded-full ${cfg.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${result.healthScore}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">{healthLabel(result.healthScore)}</p>
    </div>
  )
}
