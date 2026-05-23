export function BookingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-4 w-36 rounded bg-muted" />
        </div>
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-3 w-20 rounded bg-muted" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-5 w-20 rounded bg-muted" />
      </div>
    </div>
  )
}
