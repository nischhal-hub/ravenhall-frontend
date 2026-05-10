"use client"

import { Card } from "@/components/ui/card"
import { RevenueReport } from "@/types/revenue-response.types"
import { TrendingUp } from "lucide-react"
import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RevenueChartProps {
  data: RevenueReport
  title?: string
}

export function RevenueChart({
  data,
  title = "Revenue Overview",
}: RevenueChartProps) {
  // Transform data for chart
  const chartData = React.useMemo(() => {
    type GroupedRevenue = {
      date: string
      revenue: number
      count: number
    }

    const grouped = data.bookings.reduce<Record<string, GroupedRevenue>>(
      (acc, booking) => {
      const date = new Date(booking.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })

      if (!acc[date]) {
        acc[date] = { date, revenue: 0, count: 0 }
      }
      acc[date].revenue += booking.finalAmount
      acc[date].count += 1
      return acc
      },
      {}
    )

    return Object.values(grouped).sort(
      (a: GroupedRevenue, b: GroupedRevenue) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [data.bookings])

  const totalRevenue = data.total
  const avgPerBooking =
    data.count > 0 ? (totalRevenue / data.count).toFixed(2) : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-4xl font-bold">${totalRevenue}</p>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-3 dark:bg-emerald-900">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="mt-2 text-4xl font-bold">{data.count}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">Avg. per Booking</p>
            <p className="mt-2 text-4xl font-bold">${avgPerBooking}</p>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-8">
        <h3 className="mb-6 text-xl font-semibold">{title}</h3>

        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tickFormatter={(value: number) => `$${value}`} stroke="#64748b" />
            <Tooltip
              formatter={(value: number) => [`$${value}`, "Revenue"]}
              labelStyle={{ color: "#0f172a" }}
            />
            <Bar
              dataKey="revenue"
              fill="#1e3a5f"
              radius={[8, 8, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Revenue grouped by {data.groupBy}
        </div>
      </Card>
    </div>
  )
}
