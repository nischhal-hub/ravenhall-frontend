"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useOwnBookingsQuery } from "@/services/queries/bookings.query"
import { BookingsHeader } from "@/components/booking/Bookingsheader"
import { BookingsStats } from "@/components/booking/Bookingsstats"
import { BookingsList } from "@/components/booking/Bookingslist"
import { useRouter } from "next/navigation"

export default function BookingsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState("")

  const { data, isLoading, error, refetch, isRefetching } = useOwnBookingsQuery(
    { page, limit, search }
  )

  // Handle both flat { bookings, meta } and nested { data: { bookings, meta } }
  // @ts-expect-error — response shape varies by sendSuccess wrapper
  const bookings: Booking[] = data?.data?.bookings ?? data?.bookings ?? []
  // @ts-expect-error fffff
  const meta = data?.data?.meta ?? data?.meta

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load bookings. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Stagger keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bp-1 { animation: fadeUp .45s ease both .08s; }
        .bp-2 { animation: fadeUp .45s ease both .16s; }
        .bp-3 { animation: fadeUp .45s ease both .24s; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <BookingsHeader
        totalCount={meta?.total}
        isRefetching={isRefetching}
        onRefresh={() => refetch()}
        onNewBooking={() => router.push("/lanes")}
      />

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8 sm:px-8">
        <div className="bp-1">
          <BookingsStats bookings={bookings} />
        </div>

        <div className="bp-2">
          <BookingsList
            bookings={bookings}
            meta={meta}
            isLoading={isLoading}
            search={search}
            onSearch={(v) => {
              setSearch(v)
              setPage(1)
            }}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
