import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList } from 'lucide-react'

export default function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/15">
        <ClipboardList size={30} className="text-violet-400" />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-white">Tu dashboard está vacío</h2>
      <p className="mb-8 max-w-sm text-slate-400 leading-relaxed">
        Haz el diagnóstico financiero para ver tu perfil, tus métricas personalizadas
        y las recomendaciones adaptadas a tu situación real.
      </p>
      <Link
        to="/diagnostico"
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-8 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
      >
        Hacer mi diagnóstico financiero
        <ArrowRight size={18} />
      </Link>
      <p className="mt-4 text-sm text-slate-600">Gratis · Sin registro · 3 minutos</p>
    </div>
  )
}
