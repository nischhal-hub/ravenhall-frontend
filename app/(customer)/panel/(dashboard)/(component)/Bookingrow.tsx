"use client"

import { MapPin, CalendarDays, Clock } from "lucide-react"
import { BookingStatusBadge } from "@/components/reusable/status-badge"
import { formatCurrency } from "@/lib/utils"

interface BookingItem {
  id: string
  bookingRef: string
  status: string
  finalAmount: number
  createdAt?: string
  date?: string
  startTime?: string
  items?: { laneName: string }[]
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function BookingRow({ booking }: { booking: BookingItem }) {
  const lanes = booking.items?.map((i) => i.laneName).join(", ")

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-shadow hover:shadow-sm">
      {/* Left */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {booking.bookingRef}
          </span>
        </div>
        {lanes && (
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{lanes}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {booking.date && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(booking.date)}
            </span>
          )}
          {booking.startTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {booking.startTime}
            </span>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <BookingStatusBadge status={booking.status} />
        <span className="text-sm font-black text-primary">
          {formatCurrency(booking.finalAmount)}
        </span>
      </div>
    </div>
  )
}
