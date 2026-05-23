"use client"

import { RefreshCw, Plus, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BookingsHeaderProps {
  totalCount?: number
  isRefetching: boolean
  onRefresh: () => void
  onNewBooking: () => void
}

export function BookingsHeader({
  totalCount,
  isRefetching,
  onRefresh,
  onNewBooking,
}: BookingsHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-primary px-4 py-12 sm:px-8">
      {/* Grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(248 250 252) 1px, transparent 1px), linear-gradient(90deg, rgb(248 250 252) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Accent glow — using Tailwind gradient + position utilities */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <CalendarDays className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs font-bold tracking-widest text-accent uppercase">
            My Bookings
          </span>
        </div>

        {/* Title + actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-primary-foreground">
              Lane Bookings
            </h1>
            <p className="mt-1.5 text-sm text-primary-foreground/60">
              {totalCount !== undefined
                ? `${totalCount} booking${totalCount !== 1 ? "s" : ""} in total`
                : "View and manage your sessions"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefetching}
              className="h-9 rounded-xl border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20"
            >
              <RefreshCw
                className={`mr-2 h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={onNewBooking}
              className="h-9 rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
