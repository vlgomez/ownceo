import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { buildProjections } from '../../utils/projectionEngine'

interface Props {
  monthlySavings: number
  monthlyInvestment: number
}

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`
  return `€${Math.round(n)}`
}

function fmtFull(n: number): string {
  return `€${Math.abs(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
}

export default function WealthProjection({ monthlySavings, monthlyInvestment }: Props) {
  if (monthlySavings <= 0 && monthlyInvestment <= 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-sm text-slate-500">
        Añade datos de ahorro o inversión para ver la proyección patrimonial.
      </div>
    )
  }

  const projections = buildProjections(monthlySavings, monthlyInvestment)
  const maxTotal = Math.max(...projections.map(p => p.total))
  const gains20 = projections[3].investmentGains

  const showSavings = monthlySavings > 0
  const showInvestment = monthlyInvestment > 0

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
            <TrendingUp size={17} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Proyección Patrimonial</h3>
            <p className="text-xs text-slate-500">Simulación a largo plazo</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400">
          7% anual compuesto
        </span>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-4">
        {showSavings && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-500" />
            Ahorro acumulado
          </span>
        )}
        {showInvestment && (
          <>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-violet-600" />
              Capital invertido
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Ganancias (interés compuesto)
            </span>
          </>
        )}
      </div>

      {/* ── Bar chart ── */}
      <div className="flex gap-2 sm:gap-4">
        {projections.map((p, i) => {
          const heightPct = maxTotal > 0 ? Math.round((p.total / maxTotal) * 100) : 0
          return (
            <div key={p.years} className="flex-1 flex flex-col items-center">
              {/* Value label */}
              <span className="mb-1.5 text-center text-xs font-bold text-white tabular-nums leading-tight">
                {fmtShort(p.total)}
              </span>

              {/* Bar area — flex items-end aligns bar to bottom */}
              <div className="w-full flex items-end" style={{ height: '9rem' }}>
                <motion.div
                  className="w-full overflow-hidden rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 }}
                >
                  {/*
                    flex children ordered top-to-bottom:
                    gains (top) → capital (mid) → savings (bottom)
                    flex values are proportional to currency amounts
                  */}
                  <div className="h-full flex flex-col">
                    {p.investmentGains > 0 && (
                      <div className="bg-emerald-500 min-h-0" style={{ flex: p.investmentGains }} />
                    )}
                    {p.investedCapital > 0 && (
                      <div className="bg-violet-600 min-h-0" style={{ flex: p.investedCapital }} />
                    )}
                    {p.savings > 0 && (
                      <div className="bg-slate-500 min-h-0" style={{ flex: p.savings }} />
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Baseline */}
              <div className="w-full h-px bg-slate-700" />

              {/* Year label */}
              <span className="mt-2 text-xs text-slate-400 whitespace-nowrap">
                {p.years === 1 ? '1 año' : `${p.years} años`}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Breakdown cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {projections.map((p) => (
          <div
            key={p.years}
            className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-2"
          >
            <p className="text-xs font-semibold text-slate-400">
              {p.years === 1 ? '1 año' : `${p.years} años`}
            </p>
            <p className="text-base font-bold text-white tabular-nums leading-tight">
              {fmtFull(p.total)}
            </p>
            <div className="space-y-1 border-t border-slate-800 pt-2">
              {showSavings && (
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-sm bg-slate-500" />
                    Ahorro
                  </span>
                  <span className="tabular-nums text-slate-400">{fmtShort(p.savings)}</span>
                </div>
              )}
              {showInvestment && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-sm bg-violet-600" />
                      Aportado
                    </span>
                    <span className="tabular-nums text-violet-400">{fmtShort(p.investedCapital)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-sm bg-emerald-500" />
                      Ganancias
                    </span>
                    <span className="tabular-nums text-emerald-400">
                      +{fmtShort(p.investmentGains)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Insight ── */}
      {gains20 > 0 && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-4">
          <p className="text-sm leading-relaxed text-emerald-300">
            💡 En 20 años el interés compuesto genera{' '}
            <span className="font-bold">{fmtFull(gains20)} adicionales</span> sobre el capital
            invertido — sin aportar nada extra.
          </p>
        </div>
      )}

      {/* ── Footnote ── */}
      <p className="text-xs text-slate-700 leading-relaxed">
        Estimación orientativa. Ahorro acumulado sin rentabilidad. Inversión al 7% anual
        compuesto mensualmente. No incluye inflación, impuestos ni comisiones.
      </p>
    </div>
  )
}
