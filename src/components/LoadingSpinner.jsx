import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400 ${className}`}>
      <Loader2 className="animate-spin text-brand-500" size={28} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
