"use client"

import { CalendarCheck2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/reusable/empty-state"
import { useRouter } from "next/navigation"
import { BookingRow } from "./Bookingrow"

interface Booking {
  id: string
  bookingRef: string
  status: string
  finalAmount: number
  date?: string
  startTime?: string
  items?: { laneName: string }[]
}

export function UpcomingBookings({ bookings }: { bookings: Booking[] }) {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent">
            <CalendarCheck2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Upcoming Bookings</h2>
            <p className="text-xs text-muted-foreground">Your next sessions</p>
          </div>
        </div>
        <Button
          size="sm"
          className="h-8 rounded-xl bg-primary text-xs font-semibold text-primary-foreground"
          onClick={() => router.push("/lanes")}
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Book Lane
        </Button>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No upcoming bookings"
          description="Time to book your next lane session!"
        />
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
