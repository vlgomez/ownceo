interface RatioBarProps {
  label: string
  value: number
  target: string
  isGood: boolean
  colorClass: string
}

export default function RatioBar({ label, value, target, isGood, colorClass }: RatioBarProps) {
  const width = Math.min(Math.abs(value), 100)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <div className="flex items-center gap-2.5">
          <span className={`font-semibold tabular-nums ${isGood ? 'text-emerald-400' : 'text-amber-400'}`}>
            {value.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-600">{target}</span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${isGood ? colorClass : 'bg-amber-500'}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
