"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts"
import type { RevenueMonth } from "@/types/dashboard-response"

const RANGES = ["7d", "30d", "90d", "6m"] as const
type Range = (typeof RANGES)[number]

interface RevenueChartProps {
  data: RevenueMonth[]
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
  const [range, setRange] = useState<Range>("30d")

  // Filter data based on selected range (you can enhance this logic later)
  const filteredData = data.slice(-12) // Show last 12 months by default

  const chartData = filteredData.map((item) => {
    const date = new Date(item.month)
    return {
      date:
        date.toLocaleString("default", { month: "short" }) +
        " '" +
        date.getFullYear().toString().slice(2),
      revenue: item.revenue,
      bookings: item.bookings,
    }
  })

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0)
  const totalBookings = filteredData.reduce(
    (sum, item) => sum + item.bookings,
    0
  )

  // Moving Average (3 periods)
  const getMovingAverage = (dataPoints: any[], window: number) => {
    return dataPoints.map((_, index) => {
      const start = Math.max(0, index - window + 1)
      const subset = dataPoints.slice(start, index + 1)
      const sum = subset.reduce((acc, curr) => acc + curr.revenue, 0)
      return sum / subset.length
    })
  }

  const movingAverage = getMovingAverage(chartData, 3)

  const chartDataWithTrend = chartData.map((item, index) => ({
    ...item,
    trend: movingAverage[index],
  }))

  const formatYAxis = (value: number) => {
    if (value >= 10000) return `$${(value / 1000).toFixed(0)}k`
    return `$${value}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
          <p className="mb-2 font-semibold">{label}</p>
          <p className="text-primary">
            Revenue:{" "}
            <span className="font-bold">{formatYAxis(payload[0].value)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-muted-foreground">
              Trend: {formatYAxis(payload[1].value)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1 lg:col-span-8">
      <CardHeader className="flex flex-col pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl">Revenue Overview</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Total Revenue:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(totalRevenue)}
            </span>
          </p>
        </div>

        {/* <div className="mt-3 flex gap-2 sm:mt-0">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-4 py-1.5 text-sm transition-all ${
                range === r
                  ? "bg-primary font-medium text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {r}
            </button>
          ))}
        </div> */}
      </CardHeader>

      <CardContent>
        <div className="h-105 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartDataWithTrend}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />

              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="var(--chart-1)"
                fill="url(#colorRevenue)"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="trend"
                name="3-Period Trend"
                stroke="var(--chart-3)"
                strokeWidth={2.5}
                strokeDasharray="6 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
