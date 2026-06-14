import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Lock } from 'lucide-react'

const mockConversation = [
  {
    role: 'user',
    text: '¿Cuánto necesito para jubilarme con 55 años?',
  },
  {
    role: 'assistant',
    text: 'Basándome en tu perfil y tus datos actuales, necesitarías acumular aproximadamente €480,000. Con tu ritmo actual de ahorro lo alcanzarías a los 61 años. Para adelantarlo 6 años, necesitas incrementar tu aportación mensual en €340.',
  },
  {
    role: 'user',
    text: '¿Qué gasto podría reducir primero?',
  },
  {
    role: 'assistant',
    text: 'Tu mayor oportunidad es la categoría de suscripciones (€127/mes). Podrías reducirla a la mitad sin impacto significativo en tu calidad de vida.',
  },
]

export default function AIComplement() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20">
              <Sparkles size={16} className="text-violet-400" />
            </div>
            <span className="text-sm font-medium text-violet-400">Función premium</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Pregunta a tu asistente cuando necesites ayuda
          </h2>
          <p className="mb-6 text-slate-400 leading-relaxed">
            Las calculadoras te dan los números. El asistente te explica qué significan,
            qué hacer con ellos y cómo ajustar tu plan cuando la vida cambia.
          </p>
          <ul className="mb-8 space-y-3 text-sm text-slate-400">
            {[
              'Interpreta tus resultados con contexto personal',
              'Simula escenarios: qué pasa si cambia mi sueldo',
              'Recibe alertas cuando te desvías del plan',
              'Genera reportes mensuales con lenguaje claro',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-violet-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              Ver plan Pro
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Probar gratis (3/día)
            </Link>
          </div>
        </div>

        {/* Mock chat */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600/30">
                <Sparkles size={12} className="text-violet-400" />
              </div>
              <span className="text-sm font-medium text-slate-200">Asistente financiero</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-slate-700 px-2.5 py-1">
              <Lock size={10} className="text-slate-500" />
              <span className="text-xs text-slate-500">Pro</span>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {mockConversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-slate-800 px-4 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-900/50 px-4 py-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2">
              <span className="flex-1 text-sm text-slate-600">Escribe tu pregunta...</span>
              <Lock size={14} className="text-slate-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
