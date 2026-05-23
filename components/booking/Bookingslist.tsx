"use client"

import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingCardSkeleton } from "./Bookingcardskeleton"
import { BookingCard } from "./Bookingcard"

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

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface BookingsListProps {
  bookings: BookingItem[]
  meta?: Meta
  isLoading: boolean
  search: string
  onSearch: (v: string) => void
  onPageChange: (p: number) => void
  onBookingClick?: (id: string) => void
}

const FILTERS = [
  "ALL",
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const

export function BookingsList({
  bookings,
  meta,
  isLoading,
  search,
  onSearch,
  onPageChange,
  onBookingClick,
}: BookingsListProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL")

  const displayed =
    activeFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter)

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search reference, lane…"
            className="h-9 w-full rounded-xl border border-border bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────────────────── */}
      <div className="p-5">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No bookings found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? `No results for "${search}"`
                : "You have no bookings in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((b) => (
              <BookingCard key={b.id} booking={b} onClick={onBookingClick} />
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="h-8 w-8 rounded-lg p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="h-8 w-8 rounded-lg p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
