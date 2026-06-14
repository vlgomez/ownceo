import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const suggestions = [
  '¿Cuánto estoy gastando en entretenimiento?',
  '¿Cómo puedo ahorrar más este mes?',
  '¿Cuál es mi mayor gasto innecesario?',
  'Muéstrame un resumen de mis finanzas',
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  function sendMessage(text: string) {
    if (!text.trim()) return
    const userMsg: Message = { id: `${Date.now()}`, role: 'user', content: text }
    const aiMsg: Message = {
      id: `${Date.now() + 1}`,
      role: 'assistant',
      content:
        'Estoy analizando tu consulta... Esta función estará disponible en cuanto conectemos el modelo de IA. ¡Pronto podrás hacerme cualquier pregunta financiera!',
    }
    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
  }

  return (
    <div className="flex h-full flex-col" style={{ minHeight: 'calc(100vh - 9rem)' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Asistente IA</h1>
        <p className="mt-1 text-slate-400">Tu consejero financiero personal disponible 24/7.</p>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/20">
                <Sparkles size={28} className="text-violet-400" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">¿En qué puedo ayudarte?</h2>
              <p className="mb-8 max-w-sm text-sm text-slate-400">
                Hazme cualquier pregunta sobre tus finanzas y te daré una respuesta personalizada.
              </p>
              <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-300 hover:border-violet-500/50 hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}
            </div>
          )}
        </div>

        <ChatInput value={input} onChange={setInput} onSend={() => sendMessage(input)} />
      </div>
    </div>
  )
}
