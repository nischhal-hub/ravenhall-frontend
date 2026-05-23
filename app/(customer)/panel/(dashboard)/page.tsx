"use client"

import { useUserDashboard } from "@/services/queries/dashboard.query"

import { XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardSkeleton } from "./(component)/Dashboardskeleton"
import { DashboardHeader } from "./(component)/Dashboardheader"
import { DashboardStats } from "./(component)/Dashboardstats"
import { SpendingChart } from "./(component)/spending-chart"
import { MembershipCard } from "./(component)/MemberShipCard"
import { UpcomingBookings } from "./(component)/upcoming-bookings"
import { RecentBookings } from "./(component)/recent-bookings"

export default function UserDashboardPage() {
  const { data: raw, isLoading, error, refetch } = useUserDashboard()

  // Handle both flat and { data: {...} } wrapper shapes
  // @ts-expect-error — shape varies by sendSuccess util
  const data = raw?.data ?? raw

  if (isLoading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold text-foreground">
          Failed to load dashboard
        </p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .db-1 { animation: fadeUp .45s ease both .06s; }
        .db-2 { animation: fadeUp .45s ease both .14s; }
        .db-3 { animation: fadeUp .45s ease both .22s; }
        .db-4 { animation: fadeUp .45s ease both .30s; }
        .db-5 { animation: fadeUp .45s ease both .38s; }
      `}</style>

      <div className="min-h-screen bg-background pb-20">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <DashboardHeader user={data.user} membership={data.membership} />

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8 sm:px-8">
          {/* KPI stats */}
          <div className="db-1">
            <DashboardStats stats={data.stats} />
          </div>

          {/* Chart + membership side-by-side */}
          <div className="db-2 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SpendingChart bookings={data.recentBookings} />
            </div>
            <MembershipCard membership={data.membership} />
          </div>

          {/* Upcoming */}
          <div className="db-3">
            <UpcomingBookings bookings={data.upcomingBookings} />
          </div>

          {/* Recent */}
          <div className="db-4">
            <RecentBookings bookings={data.recentBookings} />
          </div>
        </div>
      </div>
    </>
  )
}
