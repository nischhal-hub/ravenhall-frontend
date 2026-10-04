"use client"

import { useState } from "react"
import {
  Plus,
  RefreshCw,
  Search,
  Calendar as CalendarIcon,
  Filter,
  Receipt,
  Tag,
  DollarSign,
  TrendingDown,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  FileText,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ServerFilterDataTable } from "@/components/reusable/server-table"
import {
  useExpenseCategoriesQuery,
  useExpensesQuery,
  useExpenseSummaryQuery,
} from "@/services/queries/expense.query"
import { useDeleteExpenseMutation } from "@/services/mutations/expense.mutations"
import { ExpenseFormDialog } from "./expense-form-dialog"
import { ManageCategoriesDialog } from "./manage-categories-dialog"
import type { Expense, ExpenseCategory } from "@/types/expense-response.types"
import type { ColumnDef } from "@tanstack/react-table"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"

export function ExpenseTable() {
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<string>("ALL")
  const [paymentMethod, setPaymentMethod] = useState<string>("ALL")

  // Date filters
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  const fromStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined
  const toStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  // Queries
  const { data: expensesData, isLoading, isRefetching, refetch } = useExpensesQuery({
    page,
    limit,
    search,
    categoryId: categoryId !== "ALL" ? categoryId : undefined,
    paymentMethod: paymentMethod !== "ALL" ? paymentMethod : undefined,
    from: fromStr,
    to: toStr,
  })

  const { data: summaryData } = useExpenseSummaryQuery({
    from: fromStr,
    to: toStr,
    categoryId: categoryId !== "ALL" ? categoryId : undefined,
  })

  const { data: categoriesData } = useExpenseCategoriesQuery()
  const categories = categoriesData?.data || []

  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpenseMutation()

  const expenses = expensesData?.data?.expenses || []
  const meta = expensesData?.data?.meta
  const totalAmount = expensesData?.data?.totalAmount ?? 0

  const summary = summaryData?.data
  const topCategory = summary?.byCategory?.[0]

  const handleOpenAdd = () => {
    setSelectedExpense(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (exp: Expense) => {
    setSelectedExpense(exp)
    setIsFormOpen(true)
  }

  const handleDelete = (exp: Expense) => {
    if (confirm(`Are you sure you want to delete expense "${exp.title}" ($${exp.amount.toFixed(2)})?`)) {
      deleteExpense(exp.id)
    }
  }

  // Quick Date Range presets
  const applyDatePreset = (preset: "this-month" | "last-30" | "all") => {
    if (preset === "this-month") {
      setFromDate(startOfMonth(new Date()))
      setToDate(endOfMonth(new Date()))
    } else if (preset === "last-30") {
      setFromDate(subDays(new Date(), 30))
      setToDate(new Date())
    } else {
      setFromDate(undefined)
      setToDate(undefined)
    }
    setPage(1)
  }

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "title",
      header: "Expense Details",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5 max-w-xs">
            <p className="font-semibold text-xs text-foreground truncate">{item.title}</p>
            {item.description && (
              <p className="text-[11px] text-muted-foreground truncate">{item.description}</p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category
        return (
          <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium">
            {category?.name || "General"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "expenseDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.expenseDate)
        return (
          <span className="text-xs font-mono text-muted-foreground">
            {format(date, "dd/MM/yyyy")}
          </span>
        )
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => {
        const method = row.original.paymentMethod || "OTHER"
        return (
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
            {method}
          </Badge>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount
        return (
          <span className="font-mono font-bold text-xs text-foreground">
            ${amount.toFixed(2)}
          </span>
        )
      },
    },
    {
      id: "receipt",
      header: "Receipt",
      cell: ({ row }) => {
        const url = row.original.receiptUrl
        if (!url) {
          return <span className="text-[11px] text-muted-foreground/60">—</span>
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
          >
            <FileText className="size-3" />
            <span>View</span>
            <ExternalLink className="size-2.5" />
          </a>
        )
      },
    },
    {
      accessorKey: "createdBy",
      header: "Recorded By",
      cell: ({ row }) => {
        const user = row.original.createdBy
        return (
          <span className="text-[11px] text-muted-foreground truncate">
            {user ? `${user.firstName} ${user.lastName}` : "Admin"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleOpenEdit(item)}
              className="size-7 text-muted-foreground hover:text-foreground"
              title="Edit expense"
            >
              <Edit2 className="size-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item)}
              disabled={isDeleting}
              className="size-7 text-muted-foreground hover:text-destructive"
              title="Delete expense"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Top Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Period Expenses */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Expenses
              </p>
              <p className="text-2xl font-heading font-black text-foreground font-mono">
                ${totalAmount.toFixed(2)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {fromStr && toStr
                  ? `${fromStr} to ${toStr}`
                  : "All recorded period"}
              </p>
            </div>
            <div className="size-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <TrendingDown className="size-5" />
            </div>
          </div>
        </Card>

        {/* Card 2: Total Expense Count */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Records
              </p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {meta?.total ?? expenses.length}
              </p>
              <p className="text-[11px] text-muted-foreground">Logged business costs</p>
            </div>
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Receipt className="size-5" />
            </div>
          </div>
        </Card>

        {/* Card 3: Top Expense Category */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Top Category
              </p>
              <p className="text-lg font-heading font-bold text-foreground truncate">
                {topCategory ? topCategory.categoryName : "None"}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {topCategory
                  ? `$${topCategory.total.toFixed(2)} (${topCategory.percentage}%)`
                  : "No data"}
              </p>
            </div>
            <div className="size-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <Tag className="size-5" />
            </div>
          </div>
        </Card>

        {/* Card 4: Categories Count */}
        <Card className="p-4 bg-card border-border shadow-2xs">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Categories
              </p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {categories.length}
              </p>
              <p className="text-[11px] text-muted-foreground">Default & custom tags</p>
            </div>
            <div className="size-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <Layers className="size-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Filters & Action Controls Bar ── */}
      <Card className="p-4 bg-card border-border shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search title, description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <Select
              value={categoryId}
              onValueChange={(val) => {
                setCategoryId(val)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select
              value={paymentMethod}
              onValueChange={(val) => {
                setPaymentMethod(val)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Payments</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="STRIPE">Stripe</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 font-normal">
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  {fromStr && toStr
                    ? `${format(fromDate!, "dd/MM")} - ${format(toDate!, "dd/MM")}`
                    : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 space-y-3" align="end">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <CalendarIcon className="size-3.5 text-primary" />
                  <span>Filter by Date Range</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">From</span>
                    <Input
                      type="date"
                      value={fromStr || ""}
                      onChange={(e) => {
                        setFromDate(e.target.value ? new Date(e.target.value) : undefined)
                        setPage(1)
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">To</span>
                    <Input
                      type="date"
                      value={toStr || ""}
                      onChange={(e) => {
                        setToDate(e.target.value ? new Date(e.target.value) : undefined)
                        setPage(1)
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 pt-2 border-t text-xs">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => applyDatePreset("this-month")}
                    className="h-7 text-[11px] px-2"
                  >
                    This Month
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => applyDatePreset("last-30")}
                    className="h-7 text-[11px] px-2"
                  >
                    Last 30 Days
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => applyDatePreset("all")}
                    className="h-7 text-[11px] px-2 text-muted-foreground"
                  >
                    Clear
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="size-9"
              title="Refresh expenses"
            >
              <RefreshCw className={cn("size-3.5", isRefetching && "animate-spin text-primary")} />
            </Button>

            {/* Manage Categories Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCategoriesOpen(true)}
              className="h-9 text-xs gap-1.5"
            >
              <Tag className="size-3.5 text-muted-foreground" />
              Categories
            </Button>

            {/* Add Expense Action */}
            <Button size="sm" onClick={handleOpenAdd} className="h-9 text-xs gap-1.5 bg-primary">
              <Plus className="size-3.5" />
              Add Expense
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Expenses Data Table ── */}
      <Card className="p-4 bg-card border-border shadow-2xs">
        <ServerFilterDataTable
          columns={columns}
          data={expenses}
          meta={
            meta
              ? {
                  totalCount: meta.total,
                  page: meta.page,
                  limit: meta.limit,
                  totalPages: meta.totalPages,
                }
              : undefined
          }
          isLoading={isLoading}
          onSearch={(val) => {
            setSearch(val)
            setPage(1)
          }}
          onPageChange={setPage}
          functions={{
            search: {
              placeholder: "Search expenses...",
            },
          }}
        />
      </Card>

      {/* ── Dialogs ── */}
      <ExpenseFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedExpense(null)
        }}
        expense={selectedExpense}
        onOpenManageCategories={() => {
          setIsFormOpen(false)
          setIsCategoriesOpen(true)
        }}
      />

      <ManageCategoriesDialog
        open={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
      />
    </div>
  )
}
