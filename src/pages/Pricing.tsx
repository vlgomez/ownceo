import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Gratis',
    price: '$0',
    period: 'para siempre',
    description: 'Perfecto para empezar a gestionar tus finanzas.',
    cta: 'Empezar gratis',
    highlight: false,
    features: [
      'Dashboard básico',
      'Hasta 50 transacciones/mes',
      '3 consultas con IA por día',
      'Informes mensuales',
      'Soporte por email',
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'por mes',
    description: 'Para quienes toman en serio su salud financiera.',
    cta: 'Comenzar Pro',
    highlight: true,
    features: [
      'Todo lo del plan Gratis',
      'Transacciones ilimitadas',
      'IA sin límites',
      'Análisis avanzados',
      'Metas y presupuestos',
      'Exportar a Excel / PDF',
      'Soporte prioritario',
    ],
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: 'por mes',
    description: 'Para empresas y gestión financiera avanzada.',
    cta: 'Contactar ventas',
    highlight: false,
    features: [
      'Todo lo del plan Pro',
      'Múltiples cuentas',
      'Acceso a API',
      'Dashboard personalizado',
      'Integración bancaria',
      'Soporte 24/7',
      'Onboarding dedicado',
    ],
  },
]

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Planes simples y transparentes</h1>
        <p className="text-slate-400">Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.highlight
                ? 'border-violet-500 bg-violet-600/10'
                : 'border-slate-800 bg-slate-900'
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-medium text-white">
                Más popular
              </span>
            )}

            <div className="mb-6">
              <h2 className="mb-1 text-lg font-semibold text-white">{plan.name}</h2>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">/{plan.period}</span>
              </div>
              <p className="text-sm text-slate-400">{plan.description}</p>
            </div>

            <ul className="mb-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Check size={16} className="shrink-0 text-violet-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/dashboard"
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                plan.highlight
                  ? 'bg-violet-600 text-white hover:bg-violet-500'
                  : 'border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {plan.cta}
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
