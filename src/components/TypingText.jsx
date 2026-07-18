import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function TypingText({ text, speed = 18, className = '', onDone }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i += 2
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, onDone])

  return (
    <div className={className}>
      {shown}
      <motion.span
        className="inline-block w-[2px] h-[1em] bg-brand-500 align-middle ml-0.5"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </div>
  )
}
