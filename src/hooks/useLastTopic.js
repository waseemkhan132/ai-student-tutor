import { useCallback, useEffect, useState } from 'react'

const KEY = 'tutor-last-topic'

export function useLastTopic() {
  const [lastTopic, setLastTopic] = useState(() => localStorage.getItem(KEY) || '')

  useEffect(() => { if (lastTopic) localStorage.setItem(KEY, lastTopic) }, [lastTopic])

  const save = useCallback((topic) => setLastTopic(topic), [])
  return { lastTopic, save }
}
