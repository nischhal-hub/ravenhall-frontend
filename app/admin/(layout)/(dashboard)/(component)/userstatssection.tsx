"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Users, ShieldCheck, UserCog } from "lucide-react"
import { UserStats } from "@/types/dashboard-response"

interface Props {
  stats: UserStats
}

const ROLE_CONFIG = [
  {
    key: "customers",
    label: "Customers",
    color: "var(--chart-2)",
    icon: <UserCheck className="h-3.5 w-3.5" />,
  },
  {
    key: "staff",
    label: "Staff",
    color: "var(--chart-1)",
    icon: <UserCog className="h-3.5 w-3.5" />,
  },
  {
    key: "admins",
    label: "Admins",
    color: "var(--chart-3)",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
  },
] as const

export function UserStatsSection({ stats }: Props) {
  const barData = ROLE_CONFIG.map((r) => ({
    role: r.label,
    count: stats[r.key],
    color: r.color,
  }))

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              User Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              {stats.total} registered users · {stats.newThisMonth} new this
              month
            </CardDescription>
          </div>
          <Badge className="gap-1 text-[10px]" variant="secondary">
            <Users className="h-3 w-3" />
            {stats.newThisMonth} new
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Role row pills */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {ROLE_CONFIG.map((r) => (
            <div
              key={r.key}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/40 px-2 py-3"
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                style={{ background: r.color }}
              >
                {r.icon}
              </div>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {stats[r.key]}
              </span>
              <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={barData}
            barSize={36}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="role"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: 12,
              }}
              formatter={(v: any) => [v, "Users"]}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {barData.map((d) => (
                <Cell key={d.role} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
