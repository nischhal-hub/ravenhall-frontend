"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { MembershipPlan } from "@/types/membership.types"

export function getMembershipColumns(): ColumnDef<MembershipPlan>[] {
  return [
    {
      id: "sn",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "plan",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plan <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold capitalize">
          {row.original.plan.toLowerCase()}
        </div>
      ),
    },
    {
      accessorKey: "discountPct",
      header: "Discount",
      cell: ({ row }) => (
        <div className="font-bold text-emerald-600">
          {row.original.discountPct}%
        </div>
      ),
    },
    {
      accessorKey: "durationDays",
      header: "Duration",
      cell: ({ row }) => {
        const days = row.original.durationDays
        return (
          <div>
            <span className="font-semibold">
              {days === 0 ? "Lifetime" : days}
            </span>
            <span className="ml-1 text-muted-foreground">
              {days === 0 ? "" : "days"}
            </span>
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive =
          row.original.durationDays > 0 || row.original.plan === "CASUAL"
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">System Plan</div>
      ),
    },
  ]
}
