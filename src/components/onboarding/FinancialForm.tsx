import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { FinancialData } from '../../types/diagnostic'

interface FinancialFormProps {
  initial: FinancialData
  onSubmit: (data: FinancialData) => void
  onBack: () => void
}

const FIELDS = [
  { key: 'income' as const, label: 'Ingresos mensuales netos', placeholder: '2500', emoji: '💼', hint: 'Sueldo + otras fuentes, después de impuestos' },
  { key: 'fixedExpenses' as const, label: 'Gastos fijos', placeholder: '800', emoji: '🏠', hint: 'Alquiler/hipoteca, seguros, suscripciones fijas' },
  { key: 'variableExpenses' as const, label: 'Gastos variables', placeholder: '600', emoji: '🛒', hint: 'Comida, ocio, ropa, transporte' },
  { key: 'monthlySavings' as const, label: 'Ahorro mensual', placeholder: '300', emoji: '🐖', hint: 'Lo que trasladas a tu cuenta de ahorro' },
  { key: 'monthlyInvestment' as const, label: 'Inversión mensual', placeholder: '100', emoji: '📈', hint: 'Fondos, acciones, plan de pensiones…' },
  { key: 'debt' as const, label: 'Deuda total pendiente', placeholder: '50000', emoji: '🏦', hint: 'Hipoteca + préstamos + tarjetas. Pon 0 si no tienes.' },
]

function colorFor(value: number, good: number, bad: number, higherIsBetter: boolean) {
  if (higherIsBetter) {
    if (value >= good) return 'text-emerald-400'
    if (value >= bad) return 'text-amber-400'
    return 'text-red-400'
  } else {
    if (value <= good) return 'text-emerald-400'
    if (value <= bad) return 'text-amber-400'
    return 'text-red-400'
  }
}

export default function FinancialForm({ initial, onSubmit, onBack }: FinancialFormProps) {
  const [values, setValues] = useState<FinancialData>(initial)

  const metrics = useMemo(() => {
    const { income, fixedExpenses, variableExpenses, monthlySavings, monthlyInvestment } = values
    if (!income) return null
    const totalExpenses = fixedExpenses + variableExpenses
    const savingsRate = (monthlySavings / income) * 100
    const expenseRatio = (totalExpenses / income) * 100
    const investmentRate = (monthlyInvestment / income) * 100
    const balance = income - totalExpenses - monthlySavings - monthlyInvestment
    return { savingsRate, expenseRatio, investmentRate, balance }
  }, [values])

  function handleChange(key: keyof FinancialData, raw: string) {
    const n = parseFloat(raw.replace(',', '.'))
    setValues((prev) => ({ ...prev, [key]: isNaN(n) || n < 0 ? 0 : n }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <motion.div
      className="mx-auto max-w-xl"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* Progress */}
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Paso final: datos financieros</span>
          <span>100% completado</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800">
          <div className="h-1.5 w-full rounded-full bg-violet-500" />
        </div>
      </div>

      <span className="mb-5 inline-block rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
        Datos financieros
      </span>
      <h2 className="mb-1 text-2xl font-bold text-white">Cuéntame tu situación real</h2>
      <p className="mb-8 text-sm text-slate-400">
        Todos los datos se quedan en tu dispositivo. No se envían a ningún servidor.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map(({ key, label, placeholder, emoji, hint }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">
                {emoji} {label}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                  €
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={placeholder}
                  value={values[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-8 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>
              <p className="mt-1 text-xs text-slate-600">{hint}</p>
            </div>
          ))}
        </div>

        {/* Live metrics preview */}
        {metrics && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
            <p className="mb-3 text-xs font-semibold text-slate-400">📊 Tu resumen en tiempo real</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Tasa de ahorro</p>
                <p className={`text-sm font-bold ${colorFor(metrics.savingsRate, 20, 10, true)}`}>
                  {metrics.savingsRate.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-600">objetivo: ≥20%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ratio gastos</p>
                <p className={`text-sm font-bold ${colorFor(metrics.expenseRatio, 60, 80, false)}`}>
                  {metrics.expenseRatio.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-600">objetivo: ≤70%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tasa inversión</p>
                <p className={`text-sm font-bold ${colorFor(metrics.investmentRate, 10, 5, true)}`}>
                  {metrics.investmentRate.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-600">objetivo: ≥10%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Saldo libre</p>
                <p className={`text-sm font-bold ${metrics.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  €{metrics.balance.toFixed(0)}
                </p>
                <p className="text-xs text-slate-600">objetivo: &gt;€0</p>
              </div>
            </div>
            {metrics.balance < 0 && (
              <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                ⚠️ Tus gastos + ahorro + inversión superan tus ingresos. Revisa los números.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Volver al test
          </button>
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-8 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Ver mi diagnóstico →
          </button>
        </div>
      </form>
    </motion.div>
  )
}
