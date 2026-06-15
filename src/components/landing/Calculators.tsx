import { Link } from 'react-router-dom'
import { ArrowUpRight, Wallet, PiggyBank, ShieldCheck, LineChart, Home } from 'lucide-react'

const calculators = [
  {
    icon: Wallet,
    title: 'Ingresos y gastos',
    description: 'Calcula tu balance mensual real y detecta dónde se escapa tu dinero.',
    tag: 'Esencial',
    tagColor: 'bg-violet-500/15 text-violet-400',
  },
  {
    icon: PiggyBank,
    title: 'Ahorro mensual',
    description: 'Descubre cuánto puedes ahorrar según tu sueldo y tus gastos fijos.',
    tag: 'Popular',
    tagColor: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    icon: ShieldCheck,
    title: 'Fondo de emergencia',
    description: 'Calcula cuánto necesitas tener guardado para estar realmente protegido.',
    tag: 'Esencial',
    tagColor: 'bg-violet-500/15 text-violet-400',
  },
  {
    icon: LineChart,
    title: 'Inversión a largo plazo',
    description: 'Simula cómo crecerá tu patrimonio con aportaciones periódicas y rentabilidad compuesta.',
    tag: 'Avanzado',
    tagColor: 'bg-amber-500/15 text-amber-400',
  },
  {
    icon: Home,
    title: 'Hipoteca y deuda',
    description: 'Conoce el coste real de tu crédito y cuánto pagas de más en intereses.',
    tag: 'Avanzado',
    tagColor: 'bg-amber-500/15 text-amber-400',
  },
]

export default function Calculators() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-14">
        <div>
          <h2 className="mb-3 text-3xl font-bold text-white">Calculadoras financieras</h2>
          <p className="max-w-xl text-slate-400">
            Herramientas precisas para entender tu situación y tomar decisiones con datos reales.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex shrink-0 items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          Ver todas las calculadoras
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map(({ icon: Icon, title, description, tag, tagColor }) => (
          <Link
            key={title}
            to="/dashboard"
            className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-violet-500/50 hover:bg-slate-800/60"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 group-hover:bg-violet-600/20 transition-colors">
                <Icon size={20} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColor}`}>
                {tag}
              </span>
            </div>
            <h3 className="mb-2 font-semibold text-white">{title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-slate-400">{description}</p>
            <div className="mt-4 flex items-center gap-1 text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Usar calculadora</span>
              <ArrowUpRight size={14} />
            </div>
          </Link>
        ))}

        {/* Coming soon */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-6 text-center">
          <p className="mb-1 font-medium text-slate-500">Más calculadoras</p>
          <p className="text-sm text-slate-600">FIRE, jubilación, alquiler vs. compra y más</p>
          <span className="mt-3 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-600">
            Próximamente
          </span>
        </div>
      </div>
    </section>
  )
}
