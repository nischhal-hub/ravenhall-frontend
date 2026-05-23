"use client"

import { Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BookingRow } from "./Bookingrow"

interface Booking {
  id: string
  bookingRef: string
  status: string
  finalAmount: number
  createdAt?: string
  date?: string
  startTime?: string
  items?: { laneName: string }[]
}

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Recent Bookings</h2>
            <p className="text-xs text-muted-foreground">
              Your last {bookings.length} sessions
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-xl text-xs font-semibold"
          onClick={() => router.push("/panel/bookings")}
        >
          View all <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="font-semibold text-foreground">No bookings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your booking history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}
