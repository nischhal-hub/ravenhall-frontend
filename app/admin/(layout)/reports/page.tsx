"use client"

import { useState } from "react"
import {
  Calendar as CalendarIcon,
  RefreshCw,
  TrendingUp,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import PageHeader from "@/components/ui/page-header"
import { useRevenueReport } from "@/services/queries/revenue.query"
import { RevenueChart } from "./chart"
import type { ReportGroupByInterval } from "@/types/revenue-response.types"
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns"
import { cn } from "@/lib/utils"

const GROUP_BY_OPTIONS: Array<{ value: ReportGroupByInterval; label: string }> = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
]

export default function RevenueReportPage() {
  const [groupBy, setGroupBy] = useState<ReportGroupByInterval>("day")
  const [fromDate, setFromDate] = useState<Date | undefined>(subDays(new Date(), 30))
  const [toDate, setToDate] = useState<Date | undefined>(new Date())

  const fromStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined
  const toStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined

  const { data, isLoading, isRefetching, error, refetch } = useRevenueReport({
    groupBy,
    from: fromStr,
    to: toStr,
  })

  const report = data?.data

  const applyPreset = (preset: "last-7" | "last-30" | "this-month" | "this-year" | "all") => {
    const now = new Date()
    if (preset === "last-7") {
      setFromDate(subDays(now, 7))
      setToDate(now)
      setGroupBy("day")
    } else if (preset === "last-30") {
      setFromDate(subDays(now, 30))
      setToDate(now)
      setGroupBy("day")
    } else if (preset === "this-month") {
      setFromDate(startOfMonth(now))
      setToDate(endOfMonth(now))
      setGroupBy("day")
    } else if (preset === "this-year") {
      setFromDate(startOfYear(now))
      setToDate(endOfYear(now))
      setGroupBy("month")
    } else {
      setFromDate(undefined)
      setToDate(undefined)
      setGroupBy("month")
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        size="lg"
        title="Revenue & Financial Reports"
        description="Comprehensive business performance, income breakdown, expenses, and net profit analytics"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="h-9 gap-1.5 text-xs"
            >
              <RefreshCw
                className={cn("size-3.5", isRefetching && "animate-spin text-primary")}
              />
              Refresh
            </Button>
          </div>
        }
      />

      {/* ── Filters & Interval Controls Bar ── */}
      <Card className="p-4 bg-card border-border shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Group By Interval Toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Grouping:</span>
            <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
              {GROUP_BY_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={groupBy === opt.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGroupBy(opt.value)}
                  className="h-7 text-xs px-3"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Selector & Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Preset Pills */}
            <div className="hidden sm:flex items-center gap-1 border-r pr-2 mr-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyPreset("last-7")}
                className="h-7 text-[11px] px-2"
              >
                7 Days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyPreset("last-30")}
                className="h-7 text-[11px] px-2"
              >
                30 Days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyPreset("this-month")}
                className="h-7 text-[11px] px-2"
              >
                This Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => applyPreset("this-year")}
                className="h-7 text-[11px] px-2"
              >
                This Year
              </Button>
            </div>

            {/* Custom Date Range Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-normal">
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  {fromStr && toStr
                    ? `${format(fromDate!, "dd MMM yyyy")} - ${format(toDate!, "dd MMM yyyy")}`
                    : "Custom Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 space-y-3" align="end">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <CalendarIcon className="size-3.5 text-primary" />
                  <span>Choose Date Range</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">From</span>
                    <Input
                      type="date"
                      value={fromStr || ""}
                      onChange={(e) =>
                        setFromDate(e.target.value ? new Date(e.target.value) : undefined)
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">To</span>
                    <Input
                      type="date"
                      value={toStr || ""}
                      onChange={(e) =>
                        setToDate(e.target.value ? new Date(e.target.value) : undefined)
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-1 pt-2 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => applyPreset("all")}
                    className="h-7 text-[11px] text-muted-foreground"
                  >
                    Clear Dates
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* ── Loading Skeleton ── */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-3 w-16" />
              </Card>
            ))}
          </div>
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </Card>
        </div>
      )}

      {/* ── Error State ── */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Failed to load financial report. Please check your network connection and retry.
          </AlertDescription>
        </Alert>
      )}

      {/* ── Main Report Content ── */}
      {!isLoading && !error && report && <RevenueChart report={report} />}
    </div>
  )
}
