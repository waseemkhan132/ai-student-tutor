import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card p-8 text-center flex flex-col items-center gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
        <AlertTriangle size={22} />
      </span>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">Something went wrong</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          <RefreshCw size={16} /> Retry
        </button>
      )}
    </div>
  )
}
