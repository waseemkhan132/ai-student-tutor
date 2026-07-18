import { Link, NavLink } from 'react-router-dom'
import { GraduationCap, History } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/30 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-soft group-hover:scale-105 transition">
            <GraduationCap size={20} />
          </span>
          <span className="font-bold text-lg tracking-tight">AI Student Tutor</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/history" className="hidden sm:inline-flex btn-ghost">
            <History size={16} /> History
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
