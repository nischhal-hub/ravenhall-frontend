"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

export function SpendingChart({ data }: { data: any[] }) {
  // Group by month for chart
  const chartData = data
    .reduce((acc: any[], booking) => {
      const month = new Date(booking.createdAt).toLocaleString("default", {
        month: "short",
      })
      const existing = acc.find((item) => item.month === month)

      if (existing) {
        existing.amount += booking.finalAmount
      } else {
        acc.push({ month, amount: booking.finalAmount })
      }
      return acc
    }, [])
    .slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`$${Number(value ?? 0)}`, "Spent"]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
