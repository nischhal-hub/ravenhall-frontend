"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDashboardQuery } from "@/services/queries/dashboard.query"
import { BookingStatusBreakdown } from "./(component)/bookingstatusbreakdown"
import { DashboardHeader } from "./(component)/header"
import { LaneStatsSection } from "./(component)/lanestatssection"
import { MembershipStatsSection } from "./(component)/membershipstatssection"
import { StatsCards } from "./(component)/stats-card"
import { TopCustomers } from "./(component)/topcustomers"
import { UserStatsSection } from "./(component)/userstatssection"
import { RevenueChart } from "./(component)/revenuechart"

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardQuery()

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load dashboard data.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6">
      {/* Header */}
      <DashboardHeader lastUpdated={new Date()} />

      {/* KPI Stats Cards */}
      <StatsCards userStats={data.userStats} bookingStats={data.bookingStats} />

      {/* Revenue Chart */}
      <RevenueChart data={data.revenueTimeline} />

      {/* Lane Performance */}
      <LaneStatsSection
        lanes={data.mostBookedLanes}
        laneStats={data.laneStats}
      />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UserStatsSection stats={data.userStats} />
        <MembershipStatsSection stats={data.membershipStats} />
        <BookingStatusBreakdown stats={data.bookingStats} />
        <TopCustomers customers={data.topCustomers} />
      </div>
    </div>
  )
}
