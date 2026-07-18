import { GraduationCap, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 text-white">
              <GraduationCap size={16} />
            </span>
            <span className="font-bold">AI Student Tutor</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Understand any topic in seconds with AI-powered study materials.
          </p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Features</p>
          <ul className="space-y-1">
            <li>AI Explanations</li><li>Smart Notes</li>
            <li>Interactive Flashcards</li><li>Quizzes & PDF Export</li>
          </ul>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">About</p>
          <p>Built with React, Vite, Tailwind, and Google Gemini.</p>
          <p className="mt-3 flex items-center gap-1.5">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> for students
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} AI Student Tutor. For educational use.
      </div>
    </footer>
  )
}
