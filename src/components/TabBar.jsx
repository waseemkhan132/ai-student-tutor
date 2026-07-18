import { motion } from 'framer-motion'
import { TABS } from '../types'

export default function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-1">
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition ${
              isActive ? 'text-brand-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-soft"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
