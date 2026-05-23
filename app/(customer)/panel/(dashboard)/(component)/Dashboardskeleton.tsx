function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <div className="bg-primary px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-3">
          <Bone className="h-3 w-24 opacity-30" />
          <Bone className="h-9 w-64 opacity-30" />
          <Bone className="h-3 w-40 opacity-30" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8 pb-20 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Bone className="h-72 lg:col-span-2" />
          <Bone className="h-72" />
        </div>
        <Bone className="h-64" />
        <Bone className="h-64" />
      </div>
    </div>
  )
}
