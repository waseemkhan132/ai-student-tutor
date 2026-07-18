import { useCallback, useEffect, useState } from 'react'

const KEY = 'tutor-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => read())

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(favorites)) }, [favorites])

  const toggle = useCallback((topic) => {
    setFavorites((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [topic, ...prev].slice(0, 30)
    )
  }, [])

  const isFavorite = useCallback((topic) => favorites.includes(topic), [favorites])

  return { favorites, toggle, isFavorite }
}

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}
