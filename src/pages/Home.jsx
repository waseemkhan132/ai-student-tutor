import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Brain, Lightbulb, Sparkles, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DIFFICULTIES, EXAMPLE_TOPICS } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import { useHistory } from '../hooks/useHistory'
import { useLastTopic } from '../hooks/useLastTopic'

export default function Home() {
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { topic: '', difficulty: 'Medium' },
  })
  const { favorites } = useFavorites()
  const { history, remove } = useHistory()
  const { lastTopic, save } = useLastTopic()
  const [favOpen, setFavOpen] = useState(false)

  const topic = watch('topic')

  const onSubmit = (data) => {
    const t = data.topic.trim()
    if (!t) { toast.error('Please enter a topic.'); return }
    save(t)
    const params = new URLSearchParams({ topic: t, difficulty: data.difficulty })
    navigate(`/output?${params.toString()}`)
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] overflow-hidden -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/20" />
        <div className="absolute left-1/4 top-20 h-60 w-96 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-700/10" />
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 px-4 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 mb-6"
        >
          <Sparkles size={14} /> Powered by Google Gemini
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 bg-clip-text text-transparent">
            AI Student Tutor
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Understand any topic in seconds with AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 mx-auto max-w-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="card p-5 sm:p-6 text-left">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Enter any topic you want to learn</label>
            <input
              {...register('topic', { required: 'Topic is required' })}
              placeholder="e.g. Neural Networks, Thermodynamics..."
              className="input mt-2"
              autoFocus
            />
            {errors.topic && <p className="mt-1 text-xs text-rose-500">{errors.topic.message}</p>}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Difficulty</label>
                <select {...register('difficulty')} className="input mt-2">
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                  <Sparkles size={16} /> Generate Study Material <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Try an example</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_TOPICS.map((t) => (
                  <button key={t} type="button" onClick={() => setValue('topic', t)} className="chip">{t}</button>
                ))}
              </div>
            </div>

            {lastTopic && !topic && (
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lightbulb size={14} /> Last topic: <span className="font-medium text-slate-700 dark:text-slate-200">{lastTopic}</span>
                <button type="button" onClick={() => setValue('topic', lastTopic)} className="text-brand-600 dark:text-brand-400 underline">reuse</button>
              </div>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto"
        >
          {[
            { icon: BookOpen, title: 'Rich Explanations', desc: 'Structured markdown with code, tables, and lists.' },
            { icon: Brain, title: 'Flashcards & Quizzes', desc: 'Flip cards and self-test with instant scoring.' },
            { icon: Lightbulb, title: 'Translate & PDF', desc: 'Roman Urdu / Urdu script and PDF export.' },
          ].map((f) => (
            <div key={f.title} className="card p-5 text-left hover:-translate-y-1 transition">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-3">
                <f.icon size={18} />
              </span>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold flex items-center gap-2"><Star size={16} className="text-amber-500" /> Favorite topics</p>
            <button onClick={() => setFavOpen((v) => !v)} className="text-xs text-brand-600 dark:text-brand-400">{favorites.length} saved</button>
          </div>
          {favorites.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Star a topic from the output page to save it here.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {favorites.slice(0, favOpen ? undefined : 6).map((t) => (
                <button key={t} onClick={() => setValue('topic', t)} className="chip">{t}</button>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <p className="font-semibold flex items-center gap-2 mb-3"><ArrowRight size={16} className="text-brand-500" /> Recent topics</p>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Your generated topics will appear here.</p>
          ) : (
            <ul className="space-y-2">
              {history.slice(0, 5).map((h) => (
                <li key={h.topic} className="flex items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => navigate(`/output?topic=${encodeURIComponent(h.topic)}&difficulty=${h.difficulty || 'Medium'}`)}
                    className="flex-1 text-left truncate hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    <span className="font-medium">{h.topic}</span>
                    <span className="text-slate-400"> · {h.difficulty || 'Medium'}</span>
                  </button>
                  <button onClick={() => remove(h.topic)} className="text-slate-400 hover:text-rose-500" aria-label={`Remove ${h.topic}`}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
