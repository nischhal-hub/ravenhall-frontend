"use client"

import React, { useState, useMemo } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  RotateCcw,
  CalendarCheck,
  Tag,
  CreditCard,
  Building,
  Store,
  Layers,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { RevenueReportResult } from "@/types/revenue-response.types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface RevenueChartProps {
  report: RevenueReportResult
}

export function RevenueChart({ report }: RevenueChartProps) {
  const [chartType, setChartType] = useState<"bar" | "area">("bar")
  const [transactionTab, setTransactionTab] = useState<"all" | "revenue" | "expense">("all")
  const [txSearch, setTxSearch] = useState("")

  const {
    summary,
    timeline,
    revenueBySource,
    expensesByCategory,
    revenueByPaymentMethod,
    recentTransactions,
    groupBy,
  } = report

  // Chart data
  const chartData = useMemo(() => {
    return (timeline || []).map((point) => ({
      period: point.period,
      revenue: point.revenue,
      expenses: point.expenses,
      netProfit: point.netProfit,
    }))
  }, [timeline])

  // Combine and sort recent transactions
  const combinedTransactions = useMemo(() => {
    const revs = (recentTransactions?.revenues || []).map((r) => ({
      id: r.id,
      date: new Date(r.date),
      title: r.reference,
      categoryOrSource: r.source,
      type: "REVENUE" as const,
      paymentMethod: r.paymentMethod,
      amount: r.amount,
    }))

    const exps = (recentTransactions?.expenses || []).map((e) => ({
      id: e.id,
      date: new Date(e.date),
      title: e.title,
      categoryOrSource: e.categoryName,
      type: "EXPENSE" as const,
      paymentMethod: e.paymentMethod,
      amount: e.amount,
    }))

    return [...revs, ...exps].sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [recentTransactions])

  const filteredTransactions = useMemo(() => {
    return combinedTransactions.filter((tx) => {
      if (transactionTab === "revenue" && tx.type !== "REVENUE") return false
      if (transactionTab === "expense" && tx.type !== "EXPENSE") return false
      if (txSearch.trim()) {
        const query = txSearch.toLowerCase()
        return (
          tx.title.toLowerCase().includes(query) ||
          tx.categoryOrSource.toLowerCase().includes(query) ||
          tx.paymentMethod.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [combinedTransactions, transactionTab, txSearch])

  const isProfitable = summary.netProfit >= 0

  return (
    <div className="space-y-6">
      {/* ── 1. Financial Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Gross Revenue */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Gross Revenue
            </span>
            <DollarSign className="size-4 text-primary" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-heading font-black text-foreground font-mono">
              ${summary.grossRevenue.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {summary.totalBookings} total bookings
            </p>
          </div>
        </Card>

        {/* Refunds */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Refunds / Disputed
            </span>
            <RotateCcw className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-heading font-black text-muted-foreground font-mono">
              ${summary.totalRefunds.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Customer adjustments</p>
          </div>
        </Card>

        {/* Net Revenue */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Net Revenue
            </span>
            <TrendingUp className="size-4 text-accent" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-heading font-black text-primary font-mono">
              ${summary.netRevenue.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Gross minus refunds</p>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Total Expenses
            </span>
            <TrendingDown className="size-4 text-destructive" />
          </div>
          <div className="mt-2">
            <p className="text-xl font-heading font-black text-destructive font-mono">
              ${summary.totalExpenses.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {summary.totalExpensesCount} business expenses
            </p>
          </div>
        </Card>

        {/* Net Profit */}
        <Card
          className={cn(
            "p-4 border shadow-2xs",
            isProfitable
              ? "bg-accent/5 border-accent/30"
              : "bg-destructive/5 border-destructive/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              Net Profit
            </span>
            {isProfitable ? (
              <ArrowUpRight className="size-4 text-accent" />
            ) : (
              <ArrowDownRight className="size-4 text-destructive" />
            )}
          </div>
          <div className="mt-2">
            <p
              className={cn(
                "text-xl font-heading font-black font-mono",
                isProfitable ? "text-accent" : "text-destructive"
              )}
            >
              ${summary.netProfit.toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Revenue minus expenses
            </p>
          </div>
        </Card>

        {/* Profit Margin */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Profit Margin
            </span>
            <Percent className="size-4 text-primary" />
          </div>
          <div className="mt-2">
            <p
              className={cn(
                "text-xl font-heading font-black font-mono",
                summary.profitMarginPct >= 0 ? "text-accent" : "text-destructive"
              )}
            >
              {summary.profitMarginPct.toFixed(1)}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Return on net revenue
            </p>
          </div>
        </Card>
      </div>

      {/* ── 2. Financial Performance Time-Series Chart ── */}
      <Card className="p-6 bg-card border-border shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Revenue vs Expenses vs Net Profit
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Financial trends grouped by {groupBy} ({report.dateRange.from} to {report.dateRange.to})
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
              <Button
                variant={chartType === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("bar")}
                className="h-7 text-xs px-2.5"
              >
                Bar Chart
              </Button>
              <Button
                variant={chartType === "area" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("area")}
                className="h-7 text-xs px-2.5"
              >
                Area Chart
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-6">
          {chartData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-xs text-muted-foreground">
              No financial activity recorded for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              {chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `$${Number(value).toFixed(2)} AUD`,
                      name === "revenue"
                        ? "Revenue"
                        : name === "expenses"
                        ? "Expenses"
                        : "Net Profit",
                    ]}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) =>
                      value === "revenue"
                        ? "Revenue"
                        : value === "expenses"
                        ? "Expenses"
                        : "Net Profit"
                    }
                  />
                  <Bar dataKey="revenue" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="revenue" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="expenses" />
                  <Bar dataKey="netProfit" fill="#22c55e" radius={[4, 4, 0, 0]} name="netProfit" />
                </BarChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `$${Number(value).toFixed(2)} AUD`,
                      name === "revenue"
                        ? "Revenue"
                        : name === "expenses"
                        ? "Expenses"
                        : "Net Profit",
                    ]}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) =>
                      value === "revenue"
                        ? "Revenue"
                        : value === "expenses"
                        ? "Expenses"
                        : "Net Profit"
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1e3a5f"
                    fill="url(#gradRevenue)"
                    strokeWidth={2}
                    name="revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#f43f5e"
                    fill="url(#gradExpenses)"
                    strokeWidth={2}
                    name="expenses"
                  />
                  <Area
                    type="monotone"
                    dataKey="netProfit"
                    stroke="#22c55e"
                    fill="url(#gradProfit)"
                    strokeWidth={2}
                    name="netProfit"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* ── 3. Revenue & Expense Breakdown Grids ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Breakdown 1: Revenue by Source */}
        <Card className="p-5 bg-card border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Store className="size-4 text-primary" />
              <h4 className="font-heading font-bold text-sm">Revenue by Source</h4>
            </div>
            <span className="text-xs font-mono font-semibold text-primary">
              ${summary.netRevenue.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Online Bookings */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">Online Bookings</span>
                <span className="font-mono text-muted-foreground">
                  ${revenueBySource.onlineBookings.total.toFixed(2)} (
                  {summary.netRevenue > 0
                    ? Math.round(
                        (revenueBySource.onlineBookings.total / summary.netRevenue) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${
                      summary.netRevenue > 0
                        ? (revenueBySource.onlineBookings.total / summary.netRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {revenueBySource.onlineBookings.count} bookings via customer portal
              </p>
            </div>

            {/* POS Counter Bookings */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">POS Walk-In Counter</span>
                <span className="font-mono text-muted-foreground">
                  ${revenueBySource.posBookings.total.toFixed(2)} (
                  {summary.netRevenue > 0
                    ? Math.round(
                        (revenueBySource.posBookings.total / summary.netRevenue) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{
                    width: `${
                      summary.netRevenue > 0
                        ? (revenueBySource.posBookings.total / summary.netRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {revenueBySource.posBookings.count} counter sales at the front desk
              </p>
            </div>

            {/* Memberships */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">Memberships</span>
                <span className="font-mono text-muted-foreground">
                  ${revenueBySource.memberships.total.toFixed(2)} (
                  {summary.netRevenue > 0
                    ? Math.round(
                        (revenueBySource.memberships.total / summary.netRevenue) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all"
                  style={{
                    width: `${
                      summary.netRevenue > 0
                        ? (revenueBySource.memberships.total / summary.netRevenue) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {revenueBySource.memberships.count} subscription plans
              </p>
            </div>
          </div>
        </Card>

        {/* Breakdown 2: Expenses by Category */}
        <Card className="p-5 bg-card border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-destructive" />
              <h4 className="font-heading font-bold text-sm">Expenses by Category</h4>
            </div>
            <span className="text-xs font-mono font-semibold text-destructive">
              ${summary.totalExpenses.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3 pt-1 max-h-56 overflow-y-auto pr-1">
            {expensesByCategory.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No expense records in this range.
              </p>
            ) : (
              expensesByCategory.map((cat) => (
                <div key={cat.categoryId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground truncate">{cat.categoryName}</span>
                    <span className="font-mono text-muted-foreground">
                      ${cat.total.toFixed(2)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Breakdown 3: Payment Methods */}
        <Card className="p-5 bg-card border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              <h4 className="font-heading font-bold text-sm">Payment Methods</h4>
            </div>
            <span className="text-xs text-muted-foreground">
              {revenueByPaymentMethod.length} channels
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {revenueByPaymentMethod.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                No transactions recorded.
              </p>
            ) : (
              revenueByPaymentMethod.map((pm) => (
                <div key={pm.method} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-medium text-foreground">{pm.method}</span>
                    <span className="font-mono text-muted-foreground">
                      ${pm.total.toFixed(2)} ({pm.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${pm.percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {pm.count} transactions processed
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* ── 4. Detailed Transaction Log Table ── */}
      <Card className="p-5 bg-card border-border shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground">
              Recent Financial Transactions
            </h4>
            <p className="text-xs text-muted-foreground">
              Unified transaction log of revenues and operational expenses
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search reference, description..."
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <Tabs
            value={transactionTab}
            onValueChange={(val) => setTransactionTab(val as any)}
            className="w-auto"
          >
            <TabsList className="h-8 p-1">
              <TabsTrigger value="all" className="text-xs px-3">
                All Transactions ({combinedTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs px-3">
                Revenues ({recentTransactions?.revenues?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="expense" className="text-xs px-3">
                Expenses ({recentTransactions?.expenses?.length || 0})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-xs text-muted-foreground">
            Showing {filteredTransactions.length} records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Reference / Title</th>
                <th className="py-2.5 px-3">Source / Category</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3 text-right">Amount (AUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={`${tx.type}-${tx.id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {format(tx.date, "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={tx.type === "REVENUE" ? "default" : "destructive"}
                        className={cn(
                          "text-[9px] py-0 px-1.5 font-semibold",
                          tx.type === "REVENUE"
                            ? "bg-accent/15 text-accent border border-accent/30"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        )}
                      >
                        {tx.type === "REVENUE" ? "+ Revenue" : "- Expense"}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {tx.title}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {tx.categoryOrSource}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {tx.paymentMethod}
                    </td>
                    <td
                      className={cn(
                        "py-2.5 px-3 text-right font-mono font-bold",
                        tx.type === "REVENUE" ? "text-accent" : "text-destructive"
                      )}
                    >
                      {tx.type === "REVENUE" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
