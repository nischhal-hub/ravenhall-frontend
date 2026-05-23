"use client"

import { CalendarDays, DollarSign, CalendarCheck2, XCircle } from "lucide-react"

interface Stats {
  totalBookings: number
  totalSpent: number
  upcomingBookings: number
  cancelledBookings: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount)
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
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
          className={`h-4 w-4 ${accent ? "text-accent-foreground" : "text-muted-foreground"}`}
        />
      </div>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-foreground tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

export function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={CalendarDays}
        label="Total Bookings"
        value={String(stats.totalBookings)}
        sub="All time sessions"
        accent
      />
      <StatCard
        icon={DollarSign}
        label="Total Spent"
        value={formatCurrency(stats.totalSpent)}
        sub="Across all bookings"
      />
      <StatCard
        icon={CalendarCheck2}
        label="Upcoming"
        value={String(stats.upcomingBookings)}
        sub="Scheduled sessions"
      />
      <StatCard
        icon={XCircle}
        label="Cancelled"
        value={String(stats.cancelledBookings)}
        sub="All time"
      />
    </div>
  )
}
