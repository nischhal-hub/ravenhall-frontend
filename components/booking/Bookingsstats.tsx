"use client"

import { CalendarCheck2, Clock, XCircle, Hourglass } from "lucide-react"

interface Booking {
  status: string
}

function StatCard({
  icon: Icon,
  label,
  count,
  accent = false,
}: {
  icon: React.ElementType
  label: string
  count: number
  accent?: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {accent && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-accent opacity-5" />
      )}
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
          accent ? "bg-accent" : "bg-muted"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${
            accent ? "text-accent-foreground" : "text-muted-foreground"
          }`}
        />
      </div>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-foreground tabular-nums">
        {count}
      </p>
    </div>
  )
}

export function BookingsStats({ bookings }: { bookings: Booking[] }) {
  const count = (s: string) => bookings.filter((b) => b.status === s).length

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={CalendarCheck2}
        label="Confirmed"
        count={count("CONFIRMED")}
        accent
      />
      <StatCard icon={Hourglass} label="Pending" count={count("PENDING")} />
      <StatCard icon={Clock} label="Completed" count={count("COMPLETED")} />
      <StatCard icon={XCircle} label="Cancelled" count={count("CANCELLED")} />
    </div>
  )
}
