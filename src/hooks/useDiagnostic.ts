import { useState, useCallback } from 'react'
import type { DiagnosticPhase, DiagnosticResult, FinancialData } from '../types/diagnostic'
import { buildResult } from '../utils/diagnosticEngine'

const STORAGE_KEY = 'ownceo_diagnostic_v1'

const DEFAULT_FINANCIAL_DATA: FinancialData = {
  income: 0,
  fixedExpenses: 0,
  variableExpenses: 0,
  monthlySavings: 0,
  monthlyInvestment: 0,
  debt: 0,
}

function loadSaved(): DiagnosticResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DiagnosticResult) : null
  } catch {
    return null
  }
}

function persist(result: DiagnosticResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  } catch {}
}

export function useDiagnostic() {
  const [result] = useState<DiagnosticResult | null>(loadSaved)
  const [phase, setPhase] = useState<DiagnosticPhase>(result ? 'result' : 'test')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [financialData, setFinancialData] = useState<FinancialData>(DEFAULT_FINANCIAL_DATA)
  const [currentResult, setCurrentResult] = useState<DiagnosticResult | null>(result)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const selectAnswer = useCallback((points: number) => {
    setSelectedAnswer(points)
  }, [])

  const confirmAnswer = useCallback(
    (totalQuestions: number) => {
      if (selectedAnswer === null) return
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)
      setSelectedAnswer(null)
      if (newAnswers.length >= totalQuestions) {
        setPhase('form')
      } else {
        setQuestionIndex((i) => i + 1)
      }
    },
    [answers, selectedAnswer],
  )

  const goBack = useCallback(() => {
    if (questionIndex === 0) return
    setAnswers((prev) => prev.slice(0, -1))
    setQuestionIndex((i) => i - 1)
    setSelectedAnswer(null)
  }, [questionIndex])

  const goBackToTest = useCallback(
    (totalQuestions: number) => {
      setAnswers((prev) => prev.slice(0, -1))
      setQuestionIndex(totalQuestions - 1)
      setSelectedAnswer(null)
      setPhase('test')
    },
    [],
  )

  const submitFinancialData = useCallback(
    (data: FinancialData) => {
      setFinancialData(data)
      const computed = buildResult(answers, data)
      setCurrentResult(computed)
      persist(computed)
      setPhase('result')
    },
    [answers],
  )

  const reset = useCallback(() => {
    setPhase('test')
    setQuestionIndex(0)
    setAnswers([])
    setFinancialData(DEFAULT_FINANCIAL_DATA)
    setCurrentResult(null)
    setSelectedAnswer(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return {
    phase,
    questionIndex,
    answers,
    financialData,
    result: currentResult,
    selectedAnswer,
    selectAnswer,
    confirmAnswer,
    goBack,
    goBackToTest,
    submitFinancialData,
    reset,
  }
}
