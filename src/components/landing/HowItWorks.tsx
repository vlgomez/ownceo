import { ClipboardList, PenLine, LayoutDashboard, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Haz el test',
    description:
      'Responde 10 preguntas rápidas sobre tus hábitos financieros y obtén tu perfil al instante.',
  },
  {
    number: '02',
    icon: PenLine,
    title: 'Introduce tus datos',
    description:
      'Añade tus ingresos, gastos mensuales y objetivos. Sin cuentas bancarias, sin datos sensibles.',
  },
  {
    number: '03',
    icon: LayoutDashboard,
    title: 'Visualiza tu dashboard',
    description:
      'Ve tu situación real de un vistazo: balance, tasa de ahorro, proyecciones y puntos de mejora.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Mejora tu plan',
    description:
      'Sigue las recomendaciones personalizadas, ajusta tus metas y mide tu progreso mes a mes.',
  },
]

export default function HowItWorks() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">Cómo funciona</h2>
          <p className="text-slate-400">De cero a claridad financiera total en menos de 10 minutos.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div key={title} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-full z-0 hidden h-px w-6 bg-slate-700 lg:block" />
              )}
              <div className="relative z-10 rounded-xl border border-slate-800 bg-slate-900 p-6 h-full">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20">
                    <Icon size={20} className="text-violet-400" />
                  </div>
                  <span className="text-2xl font-bold text-slate-700">{number}</span>
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
