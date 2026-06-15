import { useState, useEffect, useRef } from 'react'
import { Sparkles, RefreshCw, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import ChatInput from '../components/chat/ChatInput'
import AdvisorAnalysisMessage from '../components/chat/AdvisorAnalysisMessage'
import { useDiagnosticResult } from '../hooks/useDiagnosticResult'
import { useAuth } from '../hooks/useAuth'
import { getGoals } from '../services/goals'
import { getAllDiagnostics } from '../services/diagnostics'
import { generateAdvisorAnalysis, chatWithAdvisor } from '../services/advisor'
import type { AdvisorAnalysis } from '../types/advisor'
import type { Goal } from '../services/goals'
import type { DiagnosticResult } from '../types/diagnostic'
import LoadingScreen from '../components/shared/LoadingScreen'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isAnalysis?: boolean
  analysis?: AdvisorAnalysis
}

// ── Suggested follow-up questions ─────────────────────────────────────────────

const SUGGESTIONS = [
  '¿Cuánto necesito ahorrar para jubilarme a los 60?',
  '¿Qué inversión me recomiendas con mi perfil actual?',
  '¿Cómo puedo reducir mis gastos variables este mes?',
  '¿En cuánto tiempo podría liquidar mi deuda?',
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function Chat() {
  const { user } = useAuth()
  const { result: diagnosticResult, loading: diagLoading } = useDiagnosticResult()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [history, setHistory] = useState<DiagnosticResult[]>([])
  const [dataReady, setDataReady] = useState(false)
  const [analysisError, setAnalysisError] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const analysisStartedRef = useRef(false)

  // ── Load supporting data (goals + history) ──────────────────────────────────
  useEffect(() => {
    if (!user) return
    Promise.all([getGoals(user.id), getAllDiagnostics(user.id)]).then(([g, h]) => {
      setGoals(g)
      setHistory(h)
      setDataReady(true)
    })
  }, [user])

  // ── Auto-generate analysis once data is ready ───────────────────────────────
  useEffect(() => {
    if (!dataReady || !diagnosticResult || analysisStartedRef.current) return
    analysisStartedRef.current = true
    setAiLoading(true)
    setAnalysisError(false)

    generateAdvisorAnalysis(diagnosticResult, goals, history).then((analysis) => {
      if (analysis) {
        setMessages([{
          id: 'initial-analysis',
          role: 'assistant',
          isAnalysis: true,
          content: '',
          analysis,
        }])
      } else {
        setAnalysisError(true)
      }
      setAiLoading(false)
    })
  }, [dataReady, diagnosticResult, goals, history])

  // ── Scroll to bottom on new messages ────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, aiLoading])

  // ── Send chat message ────────────────────────────────────────────────────────
  async function sendMessage(text: string) {
    if (!text.trim() || aiLoading) return

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setAiLoading(true)

    // Only pass real chat turns (not the analysis card) to the API
    const chatTurns = updated
      .filter(m => !m.isAnalysis)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    const reply = await chatWithAdvisor(chatTurns, diagnosticResult ?? null, goals, history)

    setMessages(prev => [...prev, {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply ?? 'No pude procesar tu pregunta. Inténtalo de nuevo.',
    }])
    setAiLoading(false)
  }

  // ── Regenerate analysis ──────────────────────────────────────────────────────
  async function regenerate() {
    if (!diagnosticResult || aiLoading) return
    analysisStartedRef.current = true
    setMessages([])
    setAiLoading(true)
    setAnalysisError(false)

    const analysis = await generateAdvisorAnalysis(diagnosticResult, goals, history)
    if (analysis) {
      setMessages([{ id: `regen-${Date.now()}`, role: 'assistant', isAnalysis: true, content: '', analysis }])
    } else {
      setAnalysisError(true)
    }
    setAiLoading(false)
  }

  // ── Loading (initial data) ───────────────────────────────────────────────────
  if (diagLoading) return <LoadingScreen />

  // ── Main render ──────────────────────────────────────────────────────────────
  const showInput = !!diagnosticResult
  const hasMessages = messages.length > 0
  const lastIsAnalysis = hasMessages && messages[messages.length - 1].isAnalysis

  return (
    <div className="flex flex-col gap-4" style={{ minHeight: 'calc(100dvh - 9rem)' }}>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Asistente IA</h1>
          <p className="mt-1 text-sm text-slate-400">Análisis personalizado + chat financiero 24/7</p>
        </div>
        {hasMessages && diagnosticResult && (
          <button
            onClick={regenerate}
            disabled={aiLoading}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={aiLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Regenerar</span>
          </button>
        )}
      </div>

      {/* Chat container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

        {/* Messages / states */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">

          {/* Generating initial analysis */}
          {aiLoading && !hasMessages && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/20">
                <Sparkles size={28} className="animate-pulse text-violet-400" />
              </div>
              <p className="text-base font-semibold text-white">Analizando tu situación financiera…</p>
              <p className="mt-2 max-w-xs text-sm text-slate-400">
                Estudiando tu perfil, objetivos e historial para generar tu informe personalizado.
              </p>
            </div>
          )}

          {/* No diagnostic yet */}
          {!aiLoading && !diagnosticResult && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/20">
                <ClipboardList size={28} className="text-violet-400" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">Necesito conocer tu situación</h2>
              <p className="mb-6 max-w-sm text-sm text-slate-400">
                Completa el diagnóstico financiero para que pueda analizar tu caso concreto y darte recomendaciones reales.
              </p>
              <Link
                to="/diagnostico"
                className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                Hacer diagnóstico gratis
              </Link>
            </div>
          )}

          {/* API error */}
          {analysisError && !aiLoading && (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 py-12 text-center">
              <p className="text-sm text-slate-400">
                No se pudo conectar con el asistente. Verifica la configuración de la API.
              </p>
              <button
                onClick={regenerate}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Messages */}
          {hasMessages && (
            <div className="space-y-5">
              {messages.map((msg) =>
                msg.isAnalysis && msg.analysis ? (
                  <AdvisorAnalysisMessage key={msg.id} analysis={msg.analysis} />
                ) : (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/20">
                        <Sparkles size={14} className="text-violet-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-lg ${
                        msg.role === 'user'
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                )
              )}

              {/* Typing indicator */}
              {aiLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/20">
                    <Sparkles size={14} className="animate-pulse text-violet-400" />
                  </div>
                  <div className="rounded-2xl bg-slate-800 px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Follow-up suggestions (only shown right after analysis) */}
              {!aiLoading && lastIsAnalysis && (
                <div className="pt-2">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Preguntas frecuentes
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-300 transition-colors hover:border-violet-500/50 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {showInput && (
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage(input)}
            disabled={aiLoading}
            placeholder="Pregunta sobre tus finanzas, objetivos o inversiones…"
          />
        )}
      </div>
    </div>
  )
}
