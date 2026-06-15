import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const profiles = [
  {
    emoji: '🔥',
    name: 'Impulsivo',
    tagline: 'Gastas antes de pensar',
    color: 'border-red-500/30 bg-red-500/5',
    badgeColor: 'bg-red-500/15 text-red-400',
    traits: ['Pocas o ninguna reserva', 'Gastos superiores a ingresos', 'Sin presupuesto mensual'],
    advice: 'Necesitas un sistema de control de gastos básico antes de cualquier otra cosa.',
  },
  {
    emoji: '🏦',
    name: 'Ahorrador',
    tagline: 'Ahorras pero el dinero no trabaja',
    color: 'border-blue-500/30 bg-blue-500/5',
    badgeColor: 'bg-blue-500/15 text-blue-400',
    traits: ['Buen control del gasto', 'Dinero parado en cuenta', 'No inviertes ni te planteas hacerlo'],
    advice: 'Tu próximo paso es hacer crecer lo que ahorras. La inflación come tu dinero quieto.',
  },
  {
    emoji: '🎯',
    name: 'Estratega',
    tagline: 'Equilibrio entre control y crecimiento',
    color: 'border-violet-500/30 bg-violet-500/5',
    badgeColor: 'bg-violet-500/15 text-violet-400',
    traits: ['Presupuesto claro', 'Fondo de emergencia cubierto', 'Empieza a invertir con criterio'],
    advice: 'Vas bien. Ahora es momento de optimizar, automatizar y acelerar.',
  },
  {
    emoji: '📈',
    name: 'Inversor',
    tagline: 'Tu dinero trabaja para ti',
    color: 'border-emerald-500/30 bg-emerald-500/5',
    badgeColor: 'bg-emerald-500/15 text-emerald-400',
    traits: ['Múltiples fuentes de ingresos', 'Cartera diversificada', 'Planificación patrimonial activa'],
    advice: 'Tu reto es optimizar fiscalmente y escalar lo que ya funciona.',
  },
]

export default function FinancialProfiles() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <div className="mb-8 text-center md:mb-14">
          <h2 className="mb-3 text-3xl font-bold text-white">¿Cuál es tu perfil financiero?</h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Cada persona tiene un punto de partida diferente. OwnCEO te identifica y te da
            un plan adaptado a donde estás ahora mismo.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map(({ emoji, name, tagline, color, badgeColor, traits, advice }) => (
            <div
              key={name}
              className={`flex flex-col rounded-xl border p-6 transition-transform hover:-translate-y-1 ${color}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{emoji}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
                  {name}
                </span>
              </div>
              <h3 className="mb-1 font-semibold text-white">{name}</h3>
              <p className="mb-4 text-sm text-slate-400">{tagline}</p>
              <ul className="mb-4 flex-1 space-y-1.5">
                {traits.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="mt-0.5 shrink-0 text-slate-600">·</span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-2 border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-500">
                {advice}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/diagnostico"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-8 py-3.5 font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Descubre tu perfil ahora
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
