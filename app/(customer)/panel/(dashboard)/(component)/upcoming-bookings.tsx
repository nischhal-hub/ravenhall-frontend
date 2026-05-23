"use client"

import { CalendarCheck2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <CalendarCheck2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No upcoming bookings</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Time to book your next lane session!
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
