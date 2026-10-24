"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import {
  chartAxis,
  chartColors,
  chartGrid,
  chartLegend,
  chartTooltip,
} from "@/lib/chart-theme"
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

interface RevenueChartProps {
  data: RevenueMonth[]
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
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

  // Moving Average (3 periods)
  const getMovingAverage = (dataPoints: { revenue: number }[], window: number) => {
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

              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="date" {...chartAxis} />
              <YAxis tickFormatter={formatYAxis} {...chartAxis} />

              <Tooltip
                {...chartTooltip}
                cursor={{ stroke: "var(--border)" }}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Legend {...chartLegend} />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={chartColors.rose}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="trend"
                name="3-Period Trend"
                stroke={chartColors.amber}
                strokeWidth={2}
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
