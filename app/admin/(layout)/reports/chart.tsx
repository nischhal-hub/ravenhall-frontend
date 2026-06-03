"use client"

import { Card } from "@/components/ui/card"
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
  data: {
    groupBy: string
    total: number
    count: number
    data: {
      period: string
      total: number
      count: number
    }[]
  }
  title?: string
}

export function RevenueChart({
  data,
  title = "Revenue Overview",
}: RevenueChartProps) {
  // ✅ DIRECT USE (NO reduce needed)
  const chartData = React.useMemo(() => {
    return (data?.data || []).map((item) => ({
      date: item.period,
      revenue: item.total,
      count: item.count,
    }))
  }, [data])

  const totalRevenue = data?.total || 0
  const avgPerBooking =
    data?.count > 0 ? (totalRevenue / data.count).toFixed(2) : 0

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
            <p className="mt-2 text-4xl font-bold">{data?.count || 0}</p>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v: number) => `$${v}`} />
            <Tooltip
              formatter={(value) => {
                const amount = Number(value ?? 0)

                return [
                  `$${amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Revenue",
                ]
              }}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Revenue grouped by {data?.groupBy}
        </div>
      </Card>
    </div>
  )
}
