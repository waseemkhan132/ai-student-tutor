import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Loader2, RefreshCw, Share2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { generateStudyMaterial } from '../services/gemini'
import { useHistory } from '../hooks/useHistory'
import { useFavorites } from '../hooks/useFavorites'
import { useLastTopic } from '../hooks/useLastTopic'
import { copyToClipboard } from '../utils/clipboard'

import TabBar from '../components/TabBar'
import TranslationBar from '../components/TranslationBar'
import ExplanationTab from '../components/ExplanationTab'
import NotesTab from '../components/NotesTab'
import FlashcardsTab from '../components/FlashcardsTab'
import QuizTab from '../components/QuizTab'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { SkeletonExplanation, SkeletonFlashcards, SkeletonQuiz } from '../components/Skeletons'

export default function Output() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const topic = params.get('topic') || ''
  const difficulty = params.get('difficulty') || 'Medium'

  const { add } = useHistory()
  const { isFavorite, toggle: toggleFav } = useFavorites()
  const { save } = useLastTopic()

  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('explanation')

  const fetchMaterial = async (t, d) => {
    setLoading(true); setError(null); setMaterial(null)
    try {
      const result = await generateStudyMaterial(t, d)
      setMaterial(result)
      add({ topic: t, difficulty: d })
      save(t)
    } catch (e) {
      setError(e.message || 'Failed to generate study material.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!topic) { navigate('/'); return }
    fetchMaterial(topic, difficulty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, difficulty])

  const onShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: `AI Tutor: ${topic}`, url })
      else { await copyToClipboard(url); toast.success('Link copied to clipboard') }
    } catch { /* cancelled */ }
  }

  const getActiveContent = () => {
    if (!material) return null
    if (activeTab === 'explanation') return material.explanation
    if (activeTab === 'notes') return material.notes.map((n, i) => `${i + 1}. ${n}`).join('\n')
    if (activeTab === 'flashcards') return material.flashcards.map((c) => `Q: ${c.question}\nA: ${c.answer}`).join('\n\n')
    if (activeTab === 'quiz') return material.quiz.map((q) => `Q: ${q.question}\nOptions: ${q.options.join(', ')}\nCorrect: ${q.correct}`).join('\n\n')
    return null
  }

  const onTranslated = (tab, translated) => {
    setMaterial((prev) => {
      if (!prev) return prev
      if (tab === 'explanation') return { ...prev, explanation: translated }
      if (tab === 'notes') return { ...prev, notes: translated.split('\n').filter(Boolean).map((l) => l.replace(/^\d+\.\s*/, '')) }
      if (tab === 'flashcards') {
        const pairs = translated.split(/\n\n+/).map((blk) => {
          const m = blk.match(/Q:\s*(.*?)\nA:\s*(.*)/s)
          return m ? { question: m[1].trim(), answer: m[2].trim() } : null
        }).filter(Boolean)
        return { ...prev, flashcards: pairs.length ? pairs : prev.flashcards }
      }
      if (tab === 'quiz') {
        const blocks = translated.split(/\n\n+/).filter(Boolean)
        const parsed = blocks.map((blk) => {
          const q = blk.match(/Q:\s*(.*)/)
          const o = blk.match(/Options:\s*(.*)/)
          const c = blk.match(/Correct:\s*(.*)/)
          if (!q || !o || !c) return null
          return {
            question: q[1].trim(),
            options: o[1].split(',').map((s) => s.trim()).slice(0, 4),
            correct: c[1].trim(),
            explanation: '',
          }
        }).filter(Boolean)
        return { ...prev, quiz: parsed.length ? parsed : prev.quiz }
      }
      return prev
    })
  }

  const fav = isFavorite(topic)

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/')} className="btn-ghost text-sm mb-6">
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="card p-6 mb-6 bg-gradient-to-r from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-500 mb-1">Study Material</p>
            <h1 className="text-2xl sm:text-3xl font-bold">{topic}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Difficulty: {difficulty}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleFav(topic)} className={`btn-outline text-sm ${fav ? 'text-amber-500 border-amber-300 dark:border-amber-700' : ''}`}>
              <Star size={16} className={fav ? 'fill-amber-500' : ''} /> {fav ? 'Favorited' : 'Favorite'}
            </button>
            <button onClick={onShare} className="btn-outline text-sm"><Share2 size={16} /> Share</button>
            <button onClick={() => fetchMaterial(topic, difficulty)} className="btn-outline text-sm" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Regenerate
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingState activeTab={activeTab} />}

      {!loading && error && <ErrorState message={error} onRetry={() => fetchMaterial(topic, difficulty)} />}

      {!loading && !error && !material && <EmptyState />}

      {!loading && !error && material && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <TabBar active={activeTab} onChange={setActiveTab} />
            <TranslationBar activeTab={activeTab} onTranslated={onTranslated} getActiveContent={getActiveContent} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'explanation' && <ExplanationTab content={material.explanation} topic={topic} />}
              {activeTab === 'notes' && <NotesTab notes={material.notes} topic={topic} difficulty={difficulty} />}
              {activeTab === 'flashcards' && <FlashcardsTab flashcards={material.flashcards} />}
              {activeTab === 'quiz' && <QuizTab quiz={material.quiz} />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function LoadingState({ activeTab }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
        <Loader2 className="animate-spin" size={16} /> Generating study material with Gemini...
      </div>
      {activeTab === 'explanation' && <SkeletonExplanation />}
      {activeTab === 'flashcards' && <SkeletonFlashcards />}
      {activeTab === 'quiz' && <SkeletonQuiz />}
      {activeTab === 'notes' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-2">
              <div className="skeleton h-5 w-1/3" /><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
