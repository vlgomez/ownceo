import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ClipboardList, Minus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getAllDiagnostics } from '../services/diagnostics'
import type { DiagnosticResult, ProfileType } from '../types/diagnostic'
import LoadingScreen from '../components/shared/LoadingScreen'

// ── constants ─────────────────────────────────────────────────────────────

const PROFILE_BADGE: Record<ProfileType, string> = {
  Impulsivo: 'bg-red-500/20 text-red-400',
  Ahorrador: 'bg-blue-500/20 text-blue-400',
  Estratega: 'bg-violet-500/20 text-violet-400',
  Inversor:  'bg-emerald-500/20 text-emerald-400',
}

type NumericKey = 'healthScore' | 'savingsRate' | 'investmentRate' | 'expenseRatio' | 'availableBalance'

const METRICS: Array<{
  key: NumericKey
  label: string
  color: string
  format: (v: number) => string
  higherIsGood: boolean
  suffix: '%' | '€' | ''
}> = [
  { key: 'healthScore',      label: 'Salud financiera',  color: '#8b5cf6', format: v => `${v}/100`,          higherIsGood: true,  suffix: '' },
  { key: 'savingsRate',      label: 'Tasa de ahorro',    color: '#10b981', format: v => `${v.toFixed(1)}%`,  higherIsGood: true,  suffix: '%' },
  { key: 'investmentRate',   label: 'Tasa de inversión', color: '#3b82f6', format: v => `${v.toFixed(1)}%`,  higherIsGood: true,  suffix: '%' },
  { key: 'expenseRatio',     label: 'Ratio de gastos',   color: '#f59e0b', format: v => `${v.toFixed(1)}%`,  higherIsGood: false, suffix: '%' },
  { key: 'availableBalance', label: 'Balance disponible',color: '#06b6d4', format: v => `€${Math.abs(v).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`, higherIsGood: true, suffix: '€' },
]

// ── helpers ───────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function fmtDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
}

// ── sub-components ────────────────────────────────────────────────────────

function MiniChart({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return <div className="h-16" />

  const W = 300, H = 64, PX = 6, PY = 8
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const toX = (i: number) => PX + (i / (values.length - 1)) * (W - 2 * PX)
  const toY = (v: number) => PY + (1 - (v - min) / range) * (H - 2 * PY)
  const pts = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 64 }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      />
      {values.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill={color} />
      ))}
    </svg>
  )
}

function DeltaBadge({
  current, previous, higherIsGood, suffix,
}: {
  current: number
  previous: number
  higherIsGood: boolean
  suffix: '%' | '€' | ''
}) {
  const diff = current - previous
  if (diff === 0) {
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
        <Minus size={9} /> Sin cambio
      </span>
    )
  }
  const isGood = higherIsGood ? diff > 0 : diff < 0
  const label =
    suffix === '%' ? `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%` :
    suffix === '€' ? `${diff > 0 ? '+' : '-'}€${Math.abs(diff).toLocaleString('es-ES', { maximumFractionDigits: 0 })}` :
    `${diff > 0 ? '+' : ''}${diff.toFixed(0)}`

  return (
    <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
      isGood ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
    }`}>
      {diff > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
      {label}
    </span>
  )
}

// ── page ─────────────────────────────────────────────────────────────────

export default function History() {
  const { user } = useAuth()
  const [history, setHistory] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getAllDiagnostics(user.id)
      .then(setHistory)
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <LoadingScreen />

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ClipboardList size={48} className="mb-4 text-slate-700" />
        <h2 className="text-xl font-semibold text-white">Sin historial todavía</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Completa tu primer diagnóstico financiero para empezar a ver la evolución de tus finanzas.
        </p>
        <Link
          to="/diagnostico"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          Ir al diagnóstico
        </Link>
      </div>
    )
  }

  const first = history[0]
  const latest = history[history.length - 1]
  const hasMultiple = history.length >= 2
  const hasChart = history.length >= 3

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Historial financiero</h1>
          <p className="mt-1 text-sm text-slate-400">
            Evolución de tus métricas a lo largo del tiempo
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-400">
          {history.length} {history.length === 1 ? 'diagnóstico' : 'diagnósticos'}
        </span>
      </div>

      {/* ── Comparison: first vs latest ── */}
      {hasMultiple && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Primer diagnóstico → Último
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METRICS.map(m => (
              <div key={m.key} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <p className="mb-3 text-xs text-slate-500">{m.label}</p>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-slate-600">Inicio</p>
                    <p className="text-base font-bold text-slate-400 tabular-nums">
                      {m.format(first[m.key])}
                    </p>
                  </div>
                  <span className="mb-1 text-slate-700">→</span>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-600">Ahora</p>
                    <p className="text-xl font-bold text-white tabular-nums">
                      {m.format(latest[m.key])}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <DeltaBadge
                    current={latest[m.key]}
                    previous={first[m.key]}
                    higherIsGood={m.higherIsGood}
                    suffix={m.suffix}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Metric charts (3+ diagnoses) ── */}
      {hasChart && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Evolución de métricas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {METRICS.map(m => (
              <div key={m.key} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{m.label}</p>
                  <p className="text-sm font-bold tabular-nums" style={{ color: m.color }}>
                    {m.format(latest[m.key])}
                  </p>
                </div>
                <MiniChart values={history.map(d => d[m.key])} color={m.color} />
                <div className="mt-1.5 flex justify-between text-xs text-slate-600">
                  <span>{fmtDateShort(first.completedAt)}</span>
                  <span>{fmtDateShort(latest.completedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Timeline ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Timeline de diagnósticos
        </h2>
        <div className="space-y-3">
          {[...history].reverse().map((d, i) => (
            <div
              key={`${d.completedAt}-${i}`}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2.5 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{fmtDate(d.completedAt)}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PROFILE_BADGE[d.profile]}`}>
                      Perfil {d.profile}
                    </span>
                    {i === 0 && (
                      <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                        Más reciente
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 sm:grid-cols-4 text-xs">
                    <div>
                      <span className="text-slate-500">Salud </span>
                      <span className="font-semibold text-white tabular-nums">{d.healthScore}/100</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Ahorro </span>
                      <span className="font-semibold text-white tabular-nums">{d.savingsRate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Inversión </span>
                      <span className="font-semibold text-white tabular-nums">{d.investmentRate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Gastos </span>
                      <span className="font-semibold text-white tabular-nums">{d.expenseRatio.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Health score bubble */}
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border-2 border-violet-500/40 bg-violet-500/10">
                  <span className="text-lg font-bold text-white tabular-nums leading-none">{d.healthScore}</span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!hasMultiple && (
          <p className="mt-4 text-center text-sm text-slate-600">
            Completa un segundo diagnóstico para ver comparaciones y tendencias.
          </p>
        )}
      </section>

    </div>
  )
}
