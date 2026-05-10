"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Activity,
  ShieldCheck,
} from "lucide-react"
import { BookingStats, UserStats } from "@/types/dashboard-response"

interface Props {
  userStats: UserStats
  bookingStats: BookingStats
}

interface StatCard {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: string // tailwind bg class for icon ring
  badge?: string
}

export function StatsCards({ userStats, bookingStats }: Props) {
  const cards: StatCard[] = [
    {
      label: "Total Users",
      value: userStats.total.toString(),
      sub: `${userStats.newThisMonth} joined this month`,
      icon: <Users className="h-5 w-5" />,
      accent: "bg-[var(--chart-1)]",
      badge: `${userStats.customers} customers`,
    },
    {
      label: "Total Bookings",
      value: bookingStats.total.toString(),
      sub: `${bookingStats.confirmed} confirmed · ${bookingStats.completed} completed`,
      icon: <CalendarCheck className="h-5 w-5" />,
      accent: "bg-[var(--chart-2)]",
      badge:
        bookingStats.cancelled > 0
          ? `${bookingStats.cancelled} cancelled`
          : undefined,
    },
    {
      label: "Total Revenue",
      value: `$${bookingStats.totalRevenue.toLocaleString("en-AU", {
        minimumFractionDigits: 2,
      })}`,
      sub: `Avg $${bookingStats.avgRevenuePerBooking.toFixed(2)} per booking`,
      icon: <DollarSign className="h-5 w-5" />,
      accent: "bg-[var(--chart-3)]",
    },
    {
      label: "Active Staff",
      value: userStats.staff.toString(),
      sub: `${userStats.admins} admin${userStats.admins !== 1 ? "s" : ""}`,
      icon: <ShieldCheck className="h-5 w-5" />,
      accent: "bg-[var(--chart-4)]",
    },
    {
      label: "Pending Bookings",
      value: bookingStats.pending.toString(),
      sub: "Awaiting confirmation",
      icon: <Activity className="h-5 w-5" />,
      accent: "bg-[var(--chart-5)]",
    },
    {
      label: "Avg / Booking",
      value: `$${bookingStats.avgRevenuePerBooking.toFixed(0)}`,
      sub: "Revenue per confirmed booking",
      icon: <TrendingUp className="h-5 w-5" />,
      accent: "bg-[var(--chart-1)]",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="group relative overflow-hidden border-border/60 bg-card transition-shadow duration-200 hover:shadow-md"
        >
          {/* thin top accent stripe */}
          <div className={`absolute inset-x-0 top-0 h-0.5 ${card.accent}`} />

          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.accent} text-white shadow-sm`}
              >
                {card.icon}
              </div>
              {card.badge && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium tracking-wide"
                >
                  {card.badge}
                </Badge>
              )}
            </div>

            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              {card.label}
            </p>
            <p className="mt-0.5 text-2xl font-bold text-foreground tabular-nums">
              {card.value}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
