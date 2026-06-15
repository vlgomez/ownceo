import { Send } from 'lucide-react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ value, onChange, onSend, disabled, placeholder }: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) onSend()
  }

  return (
    <div className="border-t border-slate-800 p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Escribe tu pregunta financiera...'}
          disabled={disabled}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
