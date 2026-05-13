"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ActionButton } from "@/components/reusable/action-btn"
import { Booking } from "@/types/booking-response.types"

const statusConfig = {
  CONFIRMED: { label: "Confirmed", variant: "default" as const },
  PENDING: { label: "Pending", variant: "secondary" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
  COMPLETED: { label: "Completed", variant: "outline" as const },
}

export function getBookingColumns(): ColumnDef<Booking>[] {
  return [
    {
      id: "sn",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "bookingRef",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking Ref <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
          {row.original.bookingRef}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        )
      },
    },
    {
      id: "session",
      header: "Session",
      cell: ({ row }) => {
        const item = row.original.items[0]
        if (!item) return <span className="text-muted-foreground">—</span>

        return (
          <div className="text-sm">
            <p className="font-medium">{item.slot.lane.name}</p>
            <p className="text-muted-foreground">
              {new Date(item.slot.date).toLocaleDateString("en-GB")} •{" "}
              {item.slot.startTime} - {item.slot.endTime}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-semibold">
          ${row.original.finalAmount}
          {row.original.discountAmount > 0 && (
            <span className="ml-1 text-xs text-muted-foreground line-through">
              ${row.original.totalAmount}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const config = statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          variant: "secondary" as const,
        }

        return (
          <Badge variant={config.variant} className="capitalize">
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Booked On",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionButton<Booking>
          row={row.original}
          view={{
            onPageUrl: `/admin/bookings`,
          }}
          edit={{ key: "EDIT_BOOKING_STATUS" }}
          delete={{ type: "booking" }}
        />
      ),
    },
  ]
}
