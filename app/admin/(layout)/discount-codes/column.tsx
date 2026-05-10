"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ActionButton } from "@/components/reusable/action-btn"
import { Discount } from "@/types/discount-response.types"

export function getDiscountColumns(): ColumnDef<Discount>[] {
  return [
    {
      id: "sn",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono font-semibold tracking-wide text-primary">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="line-clamp-2 text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "discountPct",
      header: "Discount",
      cell: ({ row }) => (
        <div className="font-semibold text-emerald-600">
          {row.original.discountPct}%
        </div>
      ),
    },
    {
      id: "usage",
      header: "Usage",
      cell: ({ row }) => {
        const { usedCount, maxUses } = row.original
        return (
          <div className="text-sm">
            <span className="font-medium">{usedCount}</span>
            {maxUses && (
              <span className="text-muted-foreground"> / {maxUses}</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "validFrom",
      header: "Valid From",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.validFrom).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      accessorKey: "validTo",
      header: "Valid To",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.validTo).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionButton<Discount>
          row={row.original}
          edit={{ key: "EDIT_DISCOUNT" }}
          delete={{ type: "discount" }}
        />
      ),
    },
  ]
}
