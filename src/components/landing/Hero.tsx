import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'

const mockStats = [
  { label: 'Tasa de ahorro', value: '28%', color: 'text-emerald-400' },
  { label: 'Control gastos', value: '84%', color: 'text-emerald-400' },
  { label: 'Fondo emergencia', value: '3.2 meses', color: 'text-amber-400' },
  { label: 'Patrimonio neto', value: '+$1,240/mes', color: 'text-emerald-400' },
]

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="mb-5 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
            Diagnóstico financiero gratuito
          </span>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Deja de adivinar.{' '}
            <span className="text-violet-500">Empieza a planificar.</span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-slate-400">
            Conoce tu perfil financiero real, controla cada euro que entra y sale,
            y simula tu futuro patrimonial — sin complicaciones, sin excusas.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/diagnostico"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-8 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Haz tu diagnóstico gratis
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-8 py-3.5 font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              Ver calculadoras
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
            <span>✓ Sin tarjeta de crédito</span>
            <span>✓ 3 minutos</span>
            <span>✓ 100% gratuito</span>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">Tu diagnóstico financiero</span>
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
              Estratega
            </span>
          </div>

          {/* Health score */}
          <div className="mb-5">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-xs text-slate-500">Salud financiera</span>
              <span className="text-lg font-bold text-white">72 / 100</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800">
              <div
                className="h-2.5 rounded-full bg-violet-500 transition-all"
                style={{ width: '72%' }}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">Mejor que el 64% de personas en tu rango</p>
          </div>

          {/* Mini stats grid */}
          <div className="mb-5 grid grid-cols-2 gap-2.5">
            {mockStats.map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-800 p-3">
                <p className="mb-1 text-xs text-slate-500">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Recommendation chip */}
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-3.5">
            <p className="mb-1 text-xs font-semibold text-violet-400">💡 Recomendación principal</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Reduciendo gastos discrecionales un 12% alcanzarías la independencia financiera
              8 años antes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
