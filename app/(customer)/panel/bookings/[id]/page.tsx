"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { useBookingById } from "@/services/queries/bookings.query"
import { BookingDetailPage } from "@/components/booking/detail"

// ─── Skeletons ────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* top bar */}
      <div className="border-b border-border px-6 py-3">
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {/* hero */}
        <div className="space-y-3">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded" />
          <Skeleton className="mt-4 h-2 w-full rounded-full" />
        </div>
        {/* grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-52 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingDetailRoute() {
  const params = useParams()
  const id = params?.id as string

  const { data: booking, isLoading, isError, error } = useBookingById(id)

  if (isLoading) return <PageSkeleton />

  if (isError || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
        <AlertCircle className="h-8 w-8 text-rose-500" />
        <p className="text-sm font-medium">
          {(error as any)?.response?.data?.message ?? "Booking not found"}
        </p>
      </div>
    )
  }
  //   @ts-expect-error Server Component

  return <BookingDetailPage booking={booking.data} isAdmin={false} />
}
