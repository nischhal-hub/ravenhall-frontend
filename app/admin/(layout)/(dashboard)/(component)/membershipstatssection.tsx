"use client"

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Award, Star, Zap } from "lucide-react"
import { MembershipStats } from "@/types/dashboard-response"

interface Props {
  stats: MembershipStats
}

const PLAN_META = {
  annual: {
    label: "Annual",
    color: "var(--chart-1)",
    icon: <Award className="h-4 w-4" />,
    description: "Best value",
  },
  monthly: {
    label: "Monthly",
    color: "var(--chart-2)",
    icon: <Star className="h-4 w-4" />,
    description: "Flexible",
  },
  casual: {
    label: "Casual",
    color: "var(--chart-4)",
    icon: <Zap className="h-4 w-4" />,
    description: "Pay as you go",
  },
}

export function MembershipStatsSection({ stats }: Props) {
  const plans = (["annual", "monthly", "casual"] as const).map((key) => ({
    ...PLAN_META[key],
    count: stats[key],
    pct: stats.total > 0 ? Math.round((stats[key] / stats.total) * 100) : 0,
  }))

  const radialData = plans.map((p) => ({
    name: p.label,
    value: p.pct,
    fill: p.color,
  }))

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          Memberships
        </CardTitle>
        <CardDescription className="text-xs">
          {stats.total} active membership{stats.total !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Radial chart */}
          <div className="relative shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={72}
                barSize={14}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={6}
                  background={{ fill: "var(--muted)" }}
                />
                <Tooltip
                  formatter={(v: any) => [`${v}%`, ""]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* centre label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground tabular-nums">
                {stats.total}
              </span>
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                total
              </span>
            </div>
          </div>

          {/* Plan breakdown */}
          <div className="flex flex-1 flex-col gap-3">
            {plans.map((plan) => (
              <div key={plan.label} className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                  style={{ background: plan.color }}
                >
                  {plan.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {plan.label}
                    </span>
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {plan.count}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${plan.pct}%`,
                        background: plan.color,
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {plan.pct}% · {plan.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
