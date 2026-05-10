"use client"

import { useRevenueReport } from "@/services/queries/revenue.query"
import { RevenueChart } from "./chart"

export default function RevenueReportPage() {
  const { data } = useRevenueReport()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue Report</h1>
        <p className="text-muted-foreground">Daily revenue performance</p>
      </div>

      {data?.data && <RevenueChart data={data.data} />}
    </div>
  )
}
