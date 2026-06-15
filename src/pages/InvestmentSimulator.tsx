import { useState, useMemo, useEffect, useRef } from 'react'
import { Lock, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { FUNDS, FUND_MAP } from '../data/investmentFunds'
import { runSimulation } from '../utils/simulatorEngine'
import SimulatorChart from '../components/simulator/SimulatorChart'
import { useDiagnosticResult } from '../hooks/useDiagnosticResult'

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const START_YEARS = Array.from({ length: 21 }, (_, i) => 2005 + i)  // 2005–2025

function fmtEur(n: number): string {
  return `€${Math.abs(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
}

function durationLabel(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts: string[] = []
  if (y > 0) parts.push(`${y} ${y === 1 ? 'año' : 'años'}`)
  if (m > 0) parts.push(`${m} ${m === 1 ? 'mes' : 'meses'}`)
  return parts.join(', ')
}

export default function InvestmentSimulator() {
  const { result: diagResult, loading: diagLoading } = useDiagnosticResult()
  const [selectedFundId, setSelectedFundId] = useState('sp500')
  const [monthlyContrib, setMonthlyContrib] = useState('500')
  const preloadedRef = useRef(false)

  // Once the diagnostic loads, seed the contribution field once
  useEffect(() => {
    if (!diagLoading && !preloadedRef.current) {
      preloadedRef.current = true
      const mv = diagResult?.financialData.monthlyInvestment ?? 0
      if (mv > 0) setMonthlyContrib(String(mv))
    }
  }, [diagResult, diagLoading])
  const [startMonth, setStartMonth] = useState(1)
  const [startYear, setStartYear] = useState(2015)
  const [returnMode, setReturnMode] = useState<'historical' | 'custom'>('historical')
  const [customReturn, setCustomReturn] = useState('7')

  const fund = FUND_MAP[selectedFundId]

  const result = useMemo(() => {
    const contrib = parseFloat(monthlyContrib)
    if (isNaN(contrib) || contrib <= 0) return null
    const annual = returnMode === 'custom' ? (parseFloat(customReturn) || 7) / 100 : null
    return runSimulation(selectedFundId, contrib, startYear, startMonth, annual)
  }, [selectedFundId, monthlyContrib, startYear, startMonth, returnMode, customReturn])

  const hasResult = result !== null && result.dataPoints.length >= 2
  const isGain = (result?.gainLoss ?? 0) >= 0

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold text-white">Simulador de Inversión Real</h1>
          <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-400">
            <Lock size={11} />
            PREMIUM
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          ¿Cuánto valdría hoy si hubieras invertido mensualmente?
        </p>
      </div>

      {/* ── Disclaimer banner ── */}
      <div className="rounded-lg border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-xs leading-relaxed text-amber-300">
        ⚠️ <strong>Esto no es asesoramiento financiero.</strong> Es una simulación educativa con datos mock.
        Los rendimientos pasados no garantizan resultados futuros.
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">

        {/* ── LEFT: Controls ── */}
        <div className="space-y-5">

          {/* Fund selector */}
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">ETF / Fondo</p>
            <div className="grid grid-cols-2 gap-2">
              {FUNDS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFundId(f.id)}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    selectedFundId === f.id
                      ? `${f.borderClass} ${f.bgClass}`
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <p className={`text-sm font-bold ${selectedFundId === f.id ? f.textClass : 'text-slate-200'}`}>
                    {f.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{f.ticker}</p>
                  <p className={`mt-2 text-xs font-medium ${selectedFundId === f.id ? f.textClass : 'text-slate-500'}`}>
                    {f.avgReturn}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Monthly contribution */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Aportación mensual
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">€</span>
              <input
                type="number"
                min="1"
                value={monthlyContrib}
                onChange={e => setMonthlyContrib(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-8 pr-4 text-sm text-white focus:border-slate-500 focus:outline-none"
                placeholder="500"
              />
            </div>
          </div>

          {/* Start date */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fecha de inicio
            </p>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={startMonth}
                onChange={e => setStartMonth(Number(e.target.value))}
                className="rounded-xl border border-slate-700 bg-slate-900 py-3 px-3 text-sm text-white focus:border-slate-500 focus:outline-none"
              >
                {MONTHS_ES.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={startYear}
                onChange={e => setStartYear(Number(e.target.value))}
                className="rounded-xl border border-slate-700 bg-slate-900 py-3 px-3 text-sm text-white focus:border-slate-500 focus:outline-none"
              >
                {START_YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Return mode */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rentabilidad
            </p>
            <div className="flex rounded-xl border border-slate-700 bg-slate-950 p-1">
              {(['historical', 'custom'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setReturnMode(mode)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                    returnMode === mode
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mode === 'historical' ? 'Histórica (mock)' : 'Personalizada'}
                </button>
              ))}
            </div>

            {returnMode === 'custom' ? (
              <div className="mt-2 relative">
                <input
                  type="number"
                  min="-50"
                  max="50"
                  step="0.5"
                  value={customReturn}
                  onChange={e => setCustomReturn(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-4 pr-14 text-sm text-white focus:border-slate-500 focus:outline-none"
                  placeholder="7"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  % / año
                </span>
              </div>
            ) : null}

            <p className="mt-1.5 text-xs text-slate-600">
              {returnMode === 'historical'
                ? 'Incluye crash de 2008 y volatilidad real del mercado'
                : 'Rentabilidad anual constante aplicada mes a mes'}
            </p>
          </div>

          {/* Fund summary card */}
          <div className={`rounded-xl border p-4 ${fund.borderClass} ${fund.bgClass}`}>
            <p className={`text-sm font-semibold ${fund.textClass}`}>{fund.name}</p>
            <p className="mt-1 text-xs text-slate-400">{fund.description}</p>
            <p className={`mt-2 text-xs font-medium ${fund.textClass}`}>
              Rentabilidad media histórica: {fund.avgReturn}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="space-y-4">
          {hasResult && result ? (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Total aportado</p>
                  <p className="mt-1 text-xl font-bold text-white tabular-nums">
                    {fmtEur(result.totalInvested)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {durationLabel(result.months)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Valor actual estimado</p>
                  <p className={`mt-1 text-xl font-bold tabular-nums ${fund.textClass}`}>
                    {fmtEur(result.finalValue)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">junio 2026</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Ganancia / Pérdida</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {isGain
                      ? <TrendingUp size={16} className="text-emerald-400 shrink-0" />
                      : <TrendingDown size={16} className="text-red-400 shrink-0" />
                    }
                    <p className={`text-xl font-bold tabular-nums ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isGain ? '+' : ''}{fmtEur(result.gainLoss)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">sobre el capital aportado</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Rentabilidad total</p>
                  <p className={`mt-1 text-xl font-bold tabular-nums ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isGain ? '+' : ''}{result.returnPct.toFixed(1)}%
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    ×{(result.finalValue / result.totalInvested).toFixed(2)} el capital
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Evolución del portfolio</p>
                  <div className="flex items-center gap-5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-px w-6 border-t-2 border-dashed border-slate-500" />
                      Capital aportado
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-0.5 w-6 rounded-full"
                        style={{ backgroundColor: fund.accentColor }}
                      />
                      Valor portfolio
                    </span>
                  </div>
                </div>
                <SimulatorChart dataPoints={result.dataPoints} accentColor={fund.accentColor} />
              </div>
            </>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
              <div className="text-center text-slate-500">
                <BarChart3 size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  {!parseFloat(monthlyContrib) || parseFloat(monthlyContrib) <= 0
                    ? 'Introduce una aportación mensual válida'
                    : 'Configura los parámetros para ver la simulación'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Legal disclaimer ── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-2 text-xs text-slate-500">
        <p className="font-semibold text-slate-400">⚖️ Aviso legal importante</p>
        <p>
          Esta herramienta es exclusivamente educativa. Los retornos históricos mostrados son
          <strong className="text-slate-400"> datos mock aproximados</strong> y no representan datos reales
          de ningún instrumento financiero registrado. Los resultados pasados no garantizan rendimientos futuros.
        </p>
        <p>
          OwnCEO no es una entidad financiera regulada y no presta servicios de inversión.
          Consulta siempre con un asesor financiero certificado antes de tomar decisiones de inversión.
        </p>
      </div>
    </div>
  )
}
