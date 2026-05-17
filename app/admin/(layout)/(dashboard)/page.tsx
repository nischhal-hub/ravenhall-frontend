"use client"

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
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading Dashboard...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load dashboard data
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Header */}
        <DashboardHeader lastUpdated={new Date()} />

        {/* KPI Stats Cards */}
        <StatsCards
          userStats={data.userStats}
          bookingStats={data.bookingStats}
        />

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
    </div>
  )
}
