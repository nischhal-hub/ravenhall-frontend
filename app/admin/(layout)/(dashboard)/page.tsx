"use client"

import { useDashboardQuery } from "@/services/queries/dashboard.query"
import { RevenueChart } from "../reports/chart"
import { BookingStatusBreakdown } from "./(component)/bookingstatusbreakdown"
import { DashboardHeader } from "./(component)/header"
import { LaneStatsSection } from "./(component)/lanestatssection"
import { MembershipStatsSection } from "./(component)/membershipstatssection"
import { StatsCards } from "./(component)/stats-card"
import { TopCustomers } from "./(component)/topcustomers"
import { UserStatsSection } from "./(component)/userstatssection"

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

  // Prepare data for RevenueChart
  const revenueReport = {
    total: data.revenueTimeline.reduce((sum, item) => sum + item.revenue, 0),
    count: data.revenueTimeline.reduce((sum, item) => sum + item.bookings, 0),
    bookings: data.revenueTimeline.flatMap((item) =>
      Array(item.bookings).fill({
        finalAmount: item.revenue / Math.max(item.bookings, 1),
        createdAt: item.month,
      })
    ),
    groupBy: "month",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <DashboardHeader lastUpdated={new Date()} />

        {/* KPI Stats Cards */}
        <StatsCards
          userStats={data.userStats}
          bookingStats={data.bookingStats}
        />

        {/* Revenue Chart */}
        <RevenueChart data={revenueReport} />

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
