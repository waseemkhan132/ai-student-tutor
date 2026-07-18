import { BookOpen } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description = 'Generate study material to see it here.' }) {
  return (
    <div className="card p-12 text-center flex flex-col items-center gap-4">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
        <BookOpen size={26} />
      </span>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  )
}
