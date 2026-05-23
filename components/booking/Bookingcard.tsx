"use client"

import { useRouter } from "next/navigation"
import { CalendarDays, Clock, MapPin, Hash } from "lucide-react"
import { BookingStatusBadge } from "./Bookingstatusbadge"

interface BookingItem {
  id: string
  bookingRef: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: string
  finalAmount: number
  lane?: { name: string }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount)
}

interface BookingCardProps {
  booking: BookingItem
  /** Override the default route. Defaults to /bookings/:id */
  detailPath?: (id: string) => string
}

export function BookingCard({
  booking,
  detailPath = (id) => `/panel/bookings/${id}`,
}: BookingCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(detailPath(booking.id))
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* Left accent bar */}
      <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-primary" />

      <div className="pl-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="h-3.5 w-3.5" />
              <span className="font-mono text-xs font-semibold">
                {booking.bookingRef}
              </span>
            </div>
            {booking.lane?.name && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {booking.lane.name}
                </span>
              </div>
            )}
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Details */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {booking.startTime} – {booking.endTime}
          </span>
          <span>
            {booking.duration} hr{booking.duration !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Amount */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Total paid</span>
          <span className="text-base font-black text-primary">
            {formatCurrency(booking.finalAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}
