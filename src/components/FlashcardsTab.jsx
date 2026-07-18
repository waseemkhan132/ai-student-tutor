import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../utils'

export default function FlashcardsTab({ flashcards }) {
  const [order, setOrder] = useState(() => flashcards?.map((_, i) => i) || [])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const cards = useMemo(() => flashcards || [], [flashcards])
  if (!cards.length) return <p className="text-sm text-slate-500">No flashcards generated.</p>

  const current = cards[order[index]]

  const go = (delta) => {
    setFlipped(false)
    setIndex((i) => (i + delta + cards.length) % cards.length)
  }

  const onShuffle = () => {
    setOrder(shuffle(cards.map((_, i) => i)))
    setIndex(0)
    setFlipped(false)
  }

  const onReset = () => {
    setOrder(cards.map((_, i) => i))
    setIndex(0)
    setFlipped(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Card <span className="font-semibold text-brand-600 dark:text-brand-400">{index + 1}</span> of {cards.length}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={onShuffle} className="btn-ghost text-xs"><Shuffle size={14} /> Shuffle</button>
          <button onClick={onReset} className="btn-ghost text-xs"><RotateCcw size={14} /> Reset</button>
        </div>
      </div>

      <div className="relative h-64 sm:h-72" style={{ perspective: '1200px' }}>
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div
            className="card absolute inset-0 grid place-items-center p-8 text-center cursor-pointer"
            style={{ backfaceVisibility: 'hidden' }}
            onClick={() => setFlipped(true)}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">Question</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{current.question}</p>
              <p className="text-xs text-slate-400 mt-6">Click to reveal answer</p>
            </div>
          </div>
          <div
            className="card absolute inset-0 grid place-items-center p-8 text-center cursor-pointer bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            onClick={() => setFlipped(false)}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-500 mb-3">Answer</p>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">{current.answer}</p>
              <p className="text-xs text-slate-400 mt-6">Click to flip back</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={() => go(-1)} className="btn-outline" disabled={index === 0}>
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex-1 max-w-xs">
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
              style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
          </div>
        </div>
        <button onClick={() => go(1)} className="btn-outline" disabled={index === cards.length - 1}>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
