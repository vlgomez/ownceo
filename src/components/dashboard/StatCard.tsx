import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
}

export default function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
          <Icon size={16} className="text-violet-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className={`mt-1 text-xs ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
        {change}
      </p>
    </div>
  )
}
