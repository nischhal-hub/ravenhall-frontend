"use client"

import { useState } from "react"
import { useRevenueReport } from "@/services/queries/revenue.query"
import { RevenueChart } from "./chart"

export default function RevenueReportPage() {
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("month")

  const { data, isLoading, error } = useRevenueReport({
    groupBy,
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Failed to load revenue report</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Revenue Report</h1>
        <p className="text-muted-foreground">Revenue performance overview</p>
      </div>

      {/* 🔥 FILTER BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => setGroupBy("day")}
          className={`rounded-md border px-4 py-2 ${
            groupBy === "day" ? "bg-black text-white" : ""
          }`}
        >
          Day
        </button>

        <button
          onClick={() => setGroupBy("week")}
          className={`rounded-md border px-4 py-2 ${
            groupBy === "week" ? "bg-black text-white" : ""
          }`}
        >
          Week
        </button>

        <button
          onClick={() => setGroupBy("month")}
          className={`rounded-md border px-4 py-2 ${
            groupBy === "month" ? "bg-black text-white" : ""
          }`}
        >
          Month
        </button>
      </div>

      {/* Chart */}
      {data?.data?.data && <RevenueChart data={data.data.data} />}
    </div>
  )
}
