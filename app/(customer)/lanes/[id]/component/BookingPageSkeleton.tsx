import { Skeleton } from "@/components/ui/skeleton"

export function BookingPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Side Skeleton */}
      <div className="space-y-4 lg:col-span-3">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Mini Calendar Skeleton */}
        <Skeleton className="h-80 w-full rounded-2xl" />

        {/* Slots Skeleton */}
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>

      {/* Right Side Skeleton */}
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}
