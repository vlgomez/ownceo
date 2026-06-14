export default function LoadingScreen() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        <p className="text-sm text-slate-500">Cargando…</p>
      </div>
    </div>
  )
}
