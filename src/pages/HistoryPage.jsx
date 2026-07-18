import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Trash2 } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import EmptyState from '../components/EmptyState'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { history, remove, clear } = useHistory()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Search History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Topics you've generated recently.</p>
        </div>
        {history.length > 0 && (
          <button onClick={clear} className="btn-ghost text-sm"><Trash2 size={14} /> Clear all</button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState title="No history yet" description="Generate study material and it will show up here." />
      ) : (
        <ul className="space-y-2">
          {history.map((h) => (
            <li key={h.topic + h.createdAt} className="card p-4 flex items-center justify-between gap-3 hover:-translate-y-0.5 transition">
              <button
                onClick={() => navigate(`/output?topic=${encodeURIComponent(h.topic)}&difficulty=${h.difficulty || 'Medium'}`)}
                className="flex-1 text-left"
              >
                <p className="font-semibold">{h.topic}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Clock size={12} /> {new Date(h.createdAt).toLocaleString()} · {h.difficulty || 'Medium'}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/output?topic=${encodeURIComponent(h.topic)}&difficulty=${h.difficulty || 'Medium'}`)}
                  className="btn-ghost text-xs"
                >
                  Open <ArrowRight size={14} />
                </button>
                <button onClick={() => remove(h.topic)} className="text-slate-400 hover:text-rose-500" aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
