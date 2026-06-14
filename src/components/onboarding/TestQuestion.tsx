import { AnimatePresence, motion } from 'framer-motion'
import type { Question } from '../../types/diagnostic'

interface TestQuestionProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | null
  onSelect: (points: number) => void
  onConfirm: () => void
  onBack: () => void
}

export default function TestQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelect,
  onConfirm,
  onBack,
}: TestQuestionProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100
  const isLast = questionIndex + 1 === totalQuestions

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>Pregunta {questionIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
        >
          {/* Category chip */}
          <span className="mb-5 inline-block rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            {question.category}
          </span>

          {/* Question */}
          <h2 className="mb-8 text-2xl font-bold leading-snug text-white">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const active = selectedAnswer === option.points
              return (
                <button
                  key={option.points}
                  onClick={() => onSelect(option.points)}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition-all duration-150 ${
                    active
                      ? 'border-violet-500 bg-violet-600/15 text-white shadow-lg shadow-violet-500/10'
                      : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio dot */}
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        active ? 'border-violet-500 bg-violet-500' : 'border-slate-600'
                      }`}
                    >
                      {active && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={questionIndex === 0}
          className="text-sm text-slate-500 hover:text-slate-300 disabled:pointer-events-none disabled:opacity-30 transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={onConfirm}
          disabled={selectedAnswer === null}
          className="rounded-lg bg-violet-600 px-8 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          {isLast ? 'Continuar con mis datos →' : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}
