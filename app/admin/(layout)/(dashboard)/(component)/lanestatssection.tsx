"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type {
  LaneSummary,
  LaneStats as LaneStatsType,
} from "@/types/dashboard-response"

interface Props {
  lanes: LaneSummary[]
  laneStats: LaneStatsType
}

const LANE_COLORS: Record<string, string> = {
  BATTING: "var(--chart-1)",
  BOWLING: "var(--chart-2)",
  GENERAL: "var(--chart-3)",
}

const CustomBarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as LaneSummary
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-foreground">{d.laneName}</p>
      <p className="text-xs text-muted-foreground">
        Bookings:{" "}
        <span className="font-semibold text-foreground">{d.bookings}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Revenue:{" "}
        <span className="font-semibold text-foreground">
          ${d.revenue.toLocaleString()}
        </span>
      </p>
    </div>
  )
}

export function LaneStatsSection({ lanes, laneStats }: Props) {
  const pieData = Object.entries(laneStats.byType).map(([type, count]) => ({
    name: type,
    value: count,
  }))
  console.log("LaneStatsSection render", { lanes, laneStats, pieData })

  const shortName = (name: string) =>
    name.replace("Lane ", "L").replace(" —", "")

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              Lane Performance
            </CardTitle>
            <CardDescription className="text-xs">
              Bookings &amp; revenue by lane
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px]">
              {laneStats.active} active
            </Badge>
            {laneStats.inactive > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {laneStats.inactive} inactive
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Bar chart — bookings */}
          <div className="md:col-span-2">
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Bookings by Lane
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={lanes}
                margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                barSize={22}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="laneName"
                  tickFormatter={shortName}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                />
                <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                  {lanes.map((lane) => (
                    <Cell
                      key={lane.laneId}
                      fill={LANE_COLORS[lane.laneType] ?? "var(--chart-4)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — lane type distribution */}
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              By Type
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={LANE_COLORS[entry.name] ?? "var(--chart-4)"}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                />
                <Tooltip
                  formatter={(v: any) => [`${v} lanes`, ""]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
