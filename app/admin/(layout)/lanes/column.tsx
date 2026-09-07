"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { ActionButton } from "@/components/reusable/action-btn"
import { ActiveBadge } from "@/components/reusable/status-badge"
import { Lane } from "@/types/lane-response.types"

export function getLaneColumns(): ColumnDef<Lane>[] {
  return [
    {
      id: "sn",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lane Name <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.type.toLowerCase()}</span>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
    },
    {
      accessorKey: "hourlyRate",
      header: "Rate ($/hr)",
      cell: ({ row }) => <span>${row.original.hourlyRate}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => <ActiveBadge isActive={row.original.isActive} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.updatedAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionButton<Lane>
          row={row.original}
          view={{ onPageUrl: `/admin/lanes` }}
          edit={{ key: "EDIT_LANE" }}
          delete={{ type: "lanes" }}
        />
      ),
    },
  ]
}
