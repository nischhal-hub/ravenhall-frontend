"use client"

import { useState } from "react"
import {
  Receipt,
  DollarSign,
  Search,
  RefreshCw,
  Eye,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/reusable/status-badge"
import { usePosBookingsQuery } from "@/services/queries/pos.query"
import type { PosBookingListItem, PosPaymentMethod } from "@/types/pos-response.types"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

interface PosTransactionsTableProps {
  onOpenReceipt: (bookingId: string) => void
  onOpenCollectPayment: (booking: PosBookingListItem) => void
}

export function PosTransactionsTable({
  onOpenReceipt,
  onOpenCollectPayment,
}: PosTransactionsTableProps) {
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("ALL")
  const [paymentMethod, setPaymentMethod] = useState<string>("ALL")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  const dateStr = filterDate ? format(filterDate, "yyyy-MM-dd") : undefined

  const { data, isLoading, isRefetching, refetch } = usePosBookingsQuery({
    page,
    limit,
    search,
    date: dateStr,
    status: status !== "ALL" ? status : undefined,
    paymentMethod: paymentMethod !== "ALL" ? paymentMethod : undefined,
  })

  const bookings = data?.data?.bookings || []
  const meta = data?.data?.meta

  const columns: ColumnDef<PosBookingListItem>[] = [
    {
      accessorKey: "bookingRef",
      header: "Booking Ref",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-xs text-foreground">
              {item.bookingRef}
            </span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/30 text-primary font-semibold">
                POS
              </Badge>
              <BookingStatusBadge status={item.status} />
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.user
        const isGuest = user.email.includes("@guest.")
        return (
          <div className="space-y-0.5">
            <p className="font-medium text-xs text-foreground">
              {user.firstName} {user.lastName}
              {isGuest && (
                <span className="text-[10px] text-muted-foreground ml-1.5">(Guest)</span>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.phone || (isGuest ? "Counter Walk-in" : user.email)}
            </p>
          </div>
        )
      },
    },
    {
      id: "items",
      header: "Lanes & Slots",
      cell: ({ row }) => {
        const items = row.original.items || []
        const laneNames = Array.from(
          new Set(items.map((i) => i.slot?.lane?.name).filter(Boolean))
        )
        return (
          <div className="space-y-0.5">
            <p className="font-medium text-xs text-foreground">
              {laneNames.length > 0 ? laneNames.join(", ") : "Lane Session"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {items.length} {items.length === 1 ? "time slot" : "time slots"}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "finalAmount",
      header: "Total",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-xs text-foreground">
              ${item.finalAmount.toFixed(2)}
            </span>
            {item.discountAmount > 0 && (
              <p className="text-[10px] text-accent font-medium">
                Saved ${item.discountAmount.toFixed(2)}
              </p>
            )}
          </div>
        )
      },
    },
    {
      id: "payment",
      header: "Payment",
      cell: ({ row }) => {
        const item = row.original
        const method = item.payment?.paymentMethod || "CASH"
        const pStatus = item.payment?.status || (item.status === "CONFIRMED" ? "SUCCEEDED" : "PENDING")

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] py-0 px-1 font-mono">
                {method}
              </Badge>
              <PaymentStatusBadge status={pStatus} />
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "bookedBy",
      header: "Cashier",
      cell: ({ row }) => {
        const staff = row.original.bookedBy
        return (
          <span className="text-xs text-muted-foreground">
            {staff ? `${staff.firstName} ${staff.lastName}` : "Front Desk"}
          </span>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <div className="space-y-0.5 text-xs text-muted-foreground font-mono">
            <p>{format(date, "dd/MM/yyyy")}</p>
            <p className="text-[10px]">{format(date, "HH:mm")}</p>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original
        const isPending =
          item.status === "PENDING" || item.payment?.status === "PENDING"

        return (
          <div className="flex items-center gap-1.5">
            {/* Print/View Receipt */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenReceipt(item.id)}
              className="h-7 text-xs px-2 gap-1"
              title="Print Receipt"
            >
              <Receipt className="size-3 text-primary" />
              Receipt
            </Button>

            {/* Collect Payment (for unpaid/pending) */}
            {isPending && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => onOpenCollectPayment(item)}
                className="h-7 text-xs px-2 gap-1 bg-accent text-accent-foreground hover:bg-accent/90"
                title="Collect Payment"
              >
                <DollarSign className="size-3" />
                Pay
              </Button>
            )}

            {/* View Full Booking Record */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              asChild
              className="size-7 text-muted-foreground hover:text-foreground"
              title="View Booking Details"
            >
              <Link href={`/admin/bookings/${item.id}`}>
                <Eye className="size-3.5" />
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      {/* ── Filter Bar ── */}
      <Card className="p-4 bg-card border-border shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search reference, customer name, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs gap-1.5 font-normal"
                >
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  {filterDate ? format(filterDate, "dd MMM yyyy") : "All Dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={(d) => {
                    setFilterDate(d)
                    setPage(1)
                  }}
                />
                {filterDate && (
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilterDate(undefined)}
                      className="w-full h-7 text-xs text-muted-foreground"
                    >
                      Clear Date Filter
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                <SelectItem value="STRIPE">Stripe</SelectItem>
                <SelectItem value="BANK_TRANSFER">Transfer</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="size-9"
              title="Refresh"
            >
              <RefreshCw className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Table Container ── */}
      <Card className="p-4 bg-card border-border shadow-2xs">
        <ServerFilterDataTable
          columns={columns}
          data={bookings}
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
              placeholder: "Search bookings...",
            },
          }}
        />
      </Card>
    </div>
  )
}
