"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slot } from "@/types/slot-response.types"

export const getslotColumns = (): ColumnDef<Slot>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
  },

  // ✅ FIXED COLUMN
  {
    id: "laneName",
    header: "Lane",
    accessorFn: (row) => row.lane?.name || "",
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
      return date.toLocaleDateString()
    },
  },

  {
    id: "time",
    header: "Time",
    cell: ({ row }) => (
      <div>
        {row.original.startTime} - {row.original.endTime}
      </div>
    ),
  },

  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { isBlocked, isAvailable } = row.original

      if (isBlocked) {
        return <Badge variant="destructive">Blocked</Badge>
      }

      if (!isAvailable) {
        return <Badge variant="secondary">Unavailable</Badge>
      }

      return <Badge>Available</Badge>
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const slot = row.original

      return (
        <Button size="sm" variant="outline">
          {slot.isBlocked ? "Unblock" : "Block"}
        </Button>
      )
    },
  },
]
