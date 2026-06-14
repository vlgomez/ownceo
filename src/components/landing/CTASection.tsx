import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <span className="mb-5 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
          Gratis, sin tarjeta, 3 minutos
        </span>
        <h2 className="mb-4 text-4xl font-bold text-white">
          Haz tu diagnóstico financiero gratis
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-slate-400">
          Descubre qué tipo de perfil financiero eres, dónde estás perdiendo dinero
          y qué pasos concretos puedes dar esta semana.
        </p>
        <Link
          to="/diagnostico"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-10 py-4 text-base font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          Empezar el diagnóstico
          <ArrowRight size={20} />
        </Link>
        <p className="mt-5 text-sm text-slate-600">
          Más de 12,000 personas ya conocen su perfil financiero
        </p>
      </div>
    </section>
  )
}
