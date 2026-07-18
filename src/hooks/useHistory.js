import { useCallback, useEffect, useState } from 'react'

const KEY = 'tutor-history'
const MAX = 20

export function useHistory() {
  const [history, setHistory] = useState(() => read())

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(history)) }, [history])

  const add = useCallback((entry) => {
    setHistory((prev) => {
      const without = prev.filter((h) => h.topic !== entry.topic)
      return [{ ...entry, createdAt: Date.now() }, ...without].slice(0, MAX)
    })
  }, [])

  const remove = useCallback((topic) => {
    setHistory((prev) => prev.filter((h) => h.topic !== topic))
  }, [])

  const clear = useCallback(() => setHistory([]), [])

  return { history, add, remove, clear }
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}
