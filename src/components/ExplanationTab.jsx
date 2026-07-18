import { Copy, Printer } from 'lucide-react'
import { toast } from 'sonner'
import Markdown from './Markdown'
import { copyToClipboard } from '../utils/clipboard'
import { readingTime } from '../utils'

export default function ExplanationTab({ content, topic }) {
  const { words, minutes } = readingTime(content)

  const onCopy = async () => {
    await copyToClipboard(content)
    toast.success('Explanation copied')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="chip">{words} words</span>
          <span className="chip">{minutes} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCopy} className="btn-ghost text-xs"><Copy size={14} /> Copy</button>
          <button onClick={() => window.print()} className="btn-ghost text-xs"><Printer size={14} /> Print</button>
        </div>
      </div>
      <div className="card p-6 sm:p-8">
        <Markdown>{content || `No explanation available for **${topic}**.`}</Markdown>
      </div>
    </div>
  )
}
