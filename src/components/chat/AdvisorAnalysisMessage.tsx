import { useState } from 'react'
import { CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import type { AdvisorAnalysis, AdvisorRecommendation } from '../../types/advisor'

const IMPACT_CFG = {
  alto:  { label: 'Impacto Alto',  bg: 'bg-red-500/15',   text: 'text-red-400',   border: 'border-red-500/25' },
  medio: { label: 'Impacto Medio', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/25' },
  bajo:  { label: 'Impacto Bajo',  bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-600/40' },
}

function RecommendationCard({ rec, index }: { rec: AdvisorRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const cfg = IMPACT_CFG[rec.impact] ?? IMPACT_CFG.bajo

  return (
    <div className={`rounded-xl border ${cfg.border} bg-slate-950/60`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
          {index + 1}
        </span>
        <p className="flex-1 min-w-0 text-sm font-semibold leading-snug text-white">
          {rec.title}
        </p>
        <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
        {expanded
          ? <ChevronUp size={15} className="shrink-0 text-slate-500" />
          : <ChevronDown size={15} className="shrink-0 text-slate-500" />
        }
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-slate-800 px-4 pb-4 pt-3">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Qué hacer</p>
            <p className="text-sm leading-relaxed text-slate-200">{rec.action}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Por qué</p>
            <p className="text-sm leading-relaxed text-slate-400">{rec.reason}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                Beneficio estimado
              </p>
              <p className="text-sm font-medium leading-snug text-emerald-400">{rec.estimated_benefit}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Resultados en
              </p>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="shrink-0 text-slate-400" />
                <p className="text-sm font-medium text-slate-300">{rec.timeframe}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  analysis: AdvisorAnalysis
}

export default function AdvisorAnalysisMessage({ analysis }: Props) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20">
          <TrendingUp size={15} className="text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Informe financiero personalizado</p>
          <p className="text-xs text-slate-500">Generado con IA · Basado en tus datos reales</p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 p-4">
        <p className="text-sm leading-relaxed text-slate-300">{analysis.summary}</p>
      </div>

      {/* Strengths + Risks */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-slate-950/40 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
            Puntos fuertes
          </p>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-slate-950/40 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            Riesgos detectados
          </p>
          <ul className="space-y-2">
            {analysis.risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-400" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Plan de acción personalizado
        </p>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} index={i} />
          ))}
        </div>
      </div>

      {/* Next Best Action */}
      <div className="rounded-xl border border-violet-500/40 bg-violet-600/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <ArrowRight size={13} className="text-white" />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
              Tu acción prioritaria esta semana
            </p>
            <p className="text-sm leading-relaxed text-slate-200">{analysis.next_best_action}</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-700">
        ⚖️ Análisis orientativo generado con IA. No constituye asesoramiento financiero regulado.
        Consulta con un asesor certificado antes de tomar decisiones de inversión.
      </p>
    </div>
  )
}
