"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PageHeader from "@/components/ui/page-header"
import { useRevenueReport } from "@/services/queries/revenue.query"
import { RevenueChart } from "./chart"

const GROUP_BY_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
] as const

export default function RevenueReportPage() {
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("month")

  const { data, isLoading, error } = useRevenueReport({
    groupBy,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        size="lg"
        title="Revenue Report"
        description="Revenue performance overview"
      />

      <div className="flex gap-3">
        {GROUP_BY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={groupBy === option.value ? "default" : "outline"}
            onClick={() => setGroupBy(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          Loading report...
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load revenue report.</AlertDescription>
        </Alert>
      )}

      {data?.data?.data && <RevenueChart data={data.data.data} />}
    </div>
  )
}
