"use client"

import { RefreshCw, Plus, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PanelHero } from "@/components/panel/panel-hero"

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
    <PanelHero
      eyebrow="My Bookings"
      eyebrowIcon={CalendarDays}
      title="Lane Bookings"
      description={
        totalCount !== undefined
          ? `${totalCount} booking${totalCount !== 1 ? "s" : ""} in total`
          : "View and manage your sessions"
      }
      actions={
        <>
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
        </>
      }
    />
  )
}
