// components/admin/slots/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TimeSlot } from "@/types/slot-response.types"

export const getslotColumns: ColumnDef<TimeSlot>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lane",
    header: "Lane",
    cell: ({ row }) => {
      const slot = row.original
      return (
        <div>
          <p className="font-medium">{slot.lane?.name}</p>
          <p className="text-sm text-muted-foreground">{slot.lane?.type}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.startTime} - {row.original.endTime}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { isBlocked, isAvailable } = row.original

      if (isBlocked) {
        return <Badge variant="destructive">Blocked</Badge>
      }
      if (!isAvailable) {
        return <Badge variant="secondary">Unavailable</Badge>
      }
      return <Badge variant="success">Available</Badge>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const slot = row.original
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Toggle single slot block/unblock
            if (slot.isBlocked) {
              // Call unblock mutation with [slot.id]
            } else {
              // Call block mutation with [slot.id]
            }
          }}
        >
          {slot.isBlocked ? "Unblock" : "Block"}
        </Button>
      )
    },
  },
]
