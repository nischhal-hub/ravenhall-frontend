"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { BookingStats } from "@/types/dashboard-response"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  stats: BookingStats
}

const STATUS_CONFIG = [
  { key: "confirmed", label: "Confirmed", color: "var(--chart-2)" },
  { key: "completed", label: "Completed", color: "var(--chart-3)" },
  { key: "pending", label: "Pending", color: "var(--chart-4)" },
  { key: "cancelled", label: "Cancelled", color: "var(--destructive)" },
] as const

export function BookingStatusBreakdown({ stats }: Props) {
  const pieData = STATUS_CONFIG.map((s) => ({
    name: s.label,
    value: stats[s.key],
    color: s.color,
  })).filter((d) => d.value > 0)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          Booking Status
        </CardTitle>
        <CardDescription className="text-xs">
          Distribution across {stats.total} total bookings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Donut */}
          <div className="relative shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [v, name ?? ""]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tabular-nums">
                {stats.total}
              </span>
              <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                total
              </span>
            </div>
          </div>

          {/* Legend rows */}
          <div className="flex flex-1 flex-col gap-2">
            {STATUS_CONFIG.map((s) => {
              const pct =
                stats.total > 0
                  ? Math.round((stats[s.key] / stats.total) * 100)
                  : 0
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="flex-1 text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {stats[s.key]}
                  </span>
                  <span className="w-10 text-right text-[11px] text-muted-foreground">
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
