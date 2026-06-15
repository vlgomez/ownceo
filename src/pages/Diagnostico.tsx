import { Link } from 'react-router-dom'
import { QUESTIONS } from '../data/questions'
import { useDiagnostic } from '../hooks/useDiagnostic'
import { useAuth } from '../hooks/useAuth'
import { saveDiagnostic } from '../services/diagnostics'
import TestQuestion from '../components/onboarding/TestQuestion'
import FinancialForm from '../components/onboarding/FinancialForm'
import DiagnosticResult from '../components/onboarding/DiagnosticResult'

const PROFILE_COLORS: Record<string, string> = {
  Impulsivo: 'text-red-400',
  Ahorrador: 'text-blue-400',
  Estratega: 'text-violet-400',
  Inversor: 'text-emerald-400',
}

const TOTAL = QUESTIONS.length

export default function Diagnostico() {
  const { user } = useAuth()

  const {
    phase,
    questionIndex,
    result,
    financialData,
    selectedAnswer,
    selectAnswer,
    confirmAnswer,
    goBack,
    goBackToTest,
    submitFinancialData,
    reset,
  } = useDiagnostic((newResult) => {
    if (user) void saveDiagnostic(newResult, user.id)
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Minimal header */}
      <header className="border-b border-slate-800/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="text-lg font-bold text-white">
            Own<span className="text-violet-500">CEO</span>
          </Link>

          <div className="text-sm text-slate-500">
            {phase === 'test' && `Diagnóstico financiero · Pregunta ${questionIndex + 1}/${TOTAL}`}
            {phase === 'form' && 'Diagnóstico financiero · Datos financieros'}
            {phase === 'result' && result && (
              <span className={PROFILE_COLORS[result.profile] ?? 'text-slate-400'}>
                Perfil: {result.profile}
              </span>
            )}
          </div>

          <Link
            to="/"
            className="hidden text-xs text-slate-600 transition-colors hover:text-slate-400 sm:block"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-14">
        {phase === 'test' && (
          <TestQuestion
            question={QUESTIONS[questionIndex]}
            questionIndex={questionIndex}
            totalQuestions={TOTAL}
            selectedAnswer={selectedAnswer}
            onSelect={selectAnswer}
            onConfirm={() => confirmAnswer(TOTAL)}
            onBack={goBack}
          />
        )}

        {phase === 'form' && (
          <FinancialForm
            initial={financialData}
            onSubmit={submitFinancialData}
            onBack={() => goBackToTest(TOTAL)}
          />
        )}

        {phase === 'result' && result && (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">Tu diagnóstico financiero</h1>
              <p className="mt-2 text-slate-400">
                Basado en tus respuestas y datos financieros reales.
              </p>
            </div>
            <DiagnosticResult result={result} onReset={reset} />
          </>
        )}
      </div>
    </div>
  )
}
