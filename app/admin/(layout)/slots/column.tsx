"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slot } from "@/types/slot-response.types"
import {
  useBlockSlots,
  useUnblockSlots,
} from "@/services/mutations/slot.mutations"
import { toast } from "sonner"

export const getslotColumns = (): ColumnDef<Slot>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const blockMutation = useBlockSlots()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const unblockMutation = useUnblockSlots()

  return [
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
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },

    {
      id: "time",
      header: "Time",
      cell: ({ row }) => `${row.original.startTime} - ${row.original.endTime}`,
    },

    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const { isBlocked, isAvailable } = row.original

        if (isBlocked) return <Badge variant="destructive">Blocked</Badge>
        if (!isAvailable) return <Badge variant="secondary">Unavailable</Badge>
        return <Badge variant="default">Available</Badge>
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const slot = row.original
        const isBlocked = slot.isBlocked

        return (
          <Button
            size="sm"
            variant={isBlocked ? "default" : "destructive"}
            onClick={() => {
              if (isBlocked) {
                unblockMutation.mutate([slot.id], {
                  onSuccess: () => toast.success("Slot unblocked successfully"),
                })
              } else {
                blockMutation.mutate([slot.id], {
                  onSuccess: () => toast.success("Slot blocked successfully"),
                })
              }
            }}
            disabled={blockMutation.isPending || unblockMutation.isPending}
          >
            {isBlocked ? "Unblock" : "Block"}
          </Button>
        )
      },
    },
  ]
}
