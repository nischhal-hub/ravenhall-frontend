"use client"

import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface Props {
  lastUpdated?: Date
}

export function DashboardHeader({ lastUpdated }: Props) {
  const formatted = lastUpdated
    ? lastUpdated.toLocaleString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Ravenhall Cricket Centre · Admin overview
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1.5 border-chart-3 text-chart-3"
        >
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </Badge>
        {formatted && (
          <span className="text-xs text-muted-foreground">
            Updated {formatted}
          </span>
        )}
      </div>
    </div>
  )
}
