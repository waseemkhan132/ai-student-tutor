import { Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function QuizTab({ quiz }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (!quiz?.length) return <p className="text-sm text-slate-500">No quiz generated.</p>

  const score = quiz.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
  const allAnswered = Object.keys(answers).length === quiz.length

  const select = (i, option) => {
    if (submitted) return
    setAnswers((a) => ({ ...a, [i]: option }))
  }

  const restart = () => { setAnswers({}); setSubmitted(false) }

  return (
    <div className="space-y-5">
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex items-center justify-between bg-gradient-to-r from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900"
        >
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your score</p>
            <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">{score} / {quiz.length}</p>
          </div>
          <button onClick={restart} className="btn-primary"><RotateCcw size={16} /> Restart Quiz</button>
        </motion.div>
      )}

      {quiz.map((q, i) => {
        const chosen = answers[i]
        return (
          <div key={i} className="card p-5">
            <p className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
              <span className="text-brand-600 dark:text-brand-400 mr-2">Q{i + 1}.</span>{q.question}
            </p>
            <div className="grid gap-2">
              {q.options.map((opt) => {
                const isChosen = chosen === opt
                const isCorrect = q.correct === opt
                let state = 'idle'
                if (submitted) {
                  if (isCorrect) state = 'correct'
                  else if (isChosen) state = 'wrong'
                } else if (isChosen) state = 'chosen'
                return (
                  <button
                    key={opt}
                    onClick={() => select(i, opt)}
                    disabled={submitted}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm text-left transition ${
                      state === 'correct'
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : state === 'wrong'
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'
                        : state === 'chosen'
                        ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{opt}</span>
                    {state === 'correct' && <Check size={16} />}
                    {state === 'wrong' && <X size={16} />}
                  </button>
                )
              })}
            </div>
            {submitted && q.explanation && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Explanation: </span>{q.explanation}
              </p>
            )}
          </div>
        )
      })}

      {!submitted && (
        <button onClick={() => setSubmitted(true)} disabled={!allAnswered} className="btn-primary w-full sm:w-auto">
          Submit Quiz
        </button>
      )}
    </div>
  )
}
