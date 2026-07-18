export function SkeletonLine({ w = 'w-full', h = 'h-4' }) {
  return <div className={`skeleton ${h} ${w}`} />
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <SkeletonLine w="w-1/3" h="h-5" />
      <SkeletonLine /><SkeletonLine w="w-5/6" /><SkeletonLine w="w-2/3" />
    </div>
  )
}

export function SkeletonExplanation() {
  return (
    <div className="space-y-4">
      <SkeletonLine w="w-1/2" h="h-8" />
      <SkeletonLine /><SkeletonLine /><SkeletonLine w="w-5/6" />
      <SkeletonLine /><SkeletonLine w="w-3/4" /><SkeletonLine /><SkeletonLine w="w-5/6" />
    </div>
  )
}

export function SkeletonFlashcards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-6 space-y-3">
          <SkeletonLine w="w-1/4" h="h-3" /><SkeletonLine h="h-6" /><SkeletonLine w="w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonQuiz() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <SkeletonLine w="w-3/4" h="h-5" /><SkeletonLine h="h-10" /><SkeletonLine h="h-10" />
        </div>
      ))}
    </div>
  )
}
