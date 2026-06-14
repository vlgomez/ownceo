interface OnboardingStepProps {
  step: number
  total: number
  title: string
  description: string
  children: React.ReactNode
  onNext: () => void
  onBack?: () => void
}

export default function OnboardingStep({
  step,
  total,
  title,
  description,
  children,
  onNext,
  onBack,
}: OnboardingStepProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-violet-600' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
      <p className="mb-1 text-xs font-medium text-violet-400">
        Paso {step} de {total}
      </p>
      <h2 className="mb-2 text-2xl font-bold text-white">{title}</h2>
      <p className="mb-8 text-slate-400">{description}</p>
      <div className="mb-8">{children}</div>
      <div className="flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 rounded-lg border border-slate-700 py-3 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
          >
            Atrás
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 rounded-lg bg-violet-600 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
