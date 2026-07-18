import { Check, Copy, Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { copyToClipboard } from '../utils/clipboard'
import { downloadNotesPdf } from '../utils/pdf'

export default function NotesTab({ notes, topic, difficulty }) {
  const [copied, setCopied] = useState(false)

  if (!notes?.length) return <p className="text-sm text-slate-500">No notes generated.</p>

  const onCopyAll = async () => {
    const text = notes.map((n, i) => `${i + 1}. ${n}`).join('\n')
    await copyToClipboard(text)
    setCopied(true)
    toast.success('Notes copied')
    setTimeout(() => setCopied(false), 1500)
  }

  const onPdf = () => {
    downloadNotesPdf({ topic, difficulty, notes })
    toast.success('PDF downloaded')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{notes.length} concise notes</p>
        <div className="flex items-center gap-2">
          <button onClick={onCopyAll} className="btn-ghost text-xs">
            {copied ? <Check size={14} /> : <Copy size={14} />} Copy all
          </button>
          <button onClick={onPdf} className="btn-primary text-xs">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {notes.map((note, i) => (
          <div key={i} className="card p-4 group hover:-translate-y-0.5 transition">
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
