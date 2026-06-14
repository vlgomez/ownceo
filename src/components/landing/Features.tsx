import { MessageCircle, BarChart2, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Asistente IA 24/7',
    description:
      'Pregunta cualquier cosa sobre tus finanzas y obtén respuestas inteligentes en segundos.',
  },
  {
    icon: BarChart2,
    title: 'Análisis en tiempo real',
    description:
      'Visualiza tus ingresos, gastos y ahorros con gráficos interactivos y claros.',
  },
  {
    icon: Shield,
    title: 'Seguridad bancaria',
    description:
      'Tus datos financieros protegidos con encriptación de extremo a extremo.',
  },
  {
    icon: Zap,
    title: 'Automatización inteligente',
    description:
      'Reglas automáticas para categorizar y optimizar tus finanzas sin esfuerzo.',
  },
]

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">Todo lo que necesitas para crecer</h2>
        <p className="text-slate-400">Herramientas financieras inteligentes en un solo lugar.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-violet-500/50"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20">
              <Icon size={20} className="text-violet-400" />
            </div>
            <h3 className="mb-2 font-semibold text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
