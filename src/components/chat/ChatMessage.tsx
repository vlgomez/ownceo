import { Sparkles } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/20 mt-0.5">
          <Sparkles size={14} className="text-violet-400" />
        </div>
      )}
      <div
        className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === 'user'
            ? 'bg-violet-600 text-white'
            : 'bg-slate-800 text-slate-100'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
