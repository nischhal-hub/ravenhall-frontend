"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { TrendingUp } from "lucide-react"

interface Booking {
  createdAt: string
  finalAmount: number
}

function buildChartData(bookings: Booking[]) {
  const map: Record<string, number> = {}
  bookings.forEach((b) => {
    const month = new Date(b.createdAt).toLocaleString("en-AU", {
      month: "short",
      year: "2-digit",
    })
    map[month] = (map[month] ?? 0) + b.finalAmount
  })
  return Object.entries(map)
    .slice(-6)
    .map(([month, amount]) => ({
      month,
      amount: Math.round(amount * 100) / 100,
    }))
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-2.5 shadow-lg">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-base font-black text-primary">
        {new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: "AUD",
        }).format(payload[0].value)}
      </p>
    </div>
  )
}

export function SpendingChart({ bookings }: { bookings: Booking[] }) {
  const data = buildChartData(bookings)

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Spending Trend</h2>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center">
          <p className="text-sm text-muted-foreground">No spending data yet.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amount"
              fill="var(--primary)"
              radius={[8, 8, 0, 0]} // Rounded top corners
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
