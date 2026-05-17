"use client"

import { useUserDashboard } from "@/services/queries/dashboard.query"
import { RecentBookings } from "./(component)/recent-bookings"
import { SpendingChart } from "./(component)/spending-chart"
import { UpcomingBookings } from "./(component)/upcoming-bookings"
import { UserDashboardHeader } from "./(component)/user-dashboard-header"
import { UserStatsCards } from "./(component)/user-stats-cards"

export default function UserDashboardPage() {
  const { data, isLoading, error } = useUserDashboard()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading your dashboard...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load dashboard. Please try again.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto max-w-screen-2xl space-y-8 px-4">
        {/* Header */}
        <UserDashboardHeader user={data.user} membership={data.membership} />

        {/* KPI Stats Cards */}
        <UserStatsCards stats={data.stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Spending Trend Chart */}
          <div className="lg:col-span-8">
            <SpendingChart data={data.recentBookings} />
          </div>

          {/* Membership Status */}
          {/* <div className="lg:col-span-4">
            <MembershipCard membership={data.membership} />
          </div> */}
        </div>

        {/* Upcoming Bookings */}
        <UpcomingBookings bookings={data.upcomingBookings} />

        {/* Recent Bookings */}
        <RecentBookings bookings={data.recentBookings} />
      </div>
    </div>
  )
}
