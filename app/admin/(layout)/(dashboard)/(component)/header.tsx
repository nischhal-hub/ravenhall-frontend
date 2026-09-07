"use client"

import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/page-header"
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
    <PageHeader
      size="lg"
      title="Dashboard"
      description="Ravenhall Cricket Centre · Admin overview"
      actions={
        <>
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
        </>
      }
    />
  )
}
