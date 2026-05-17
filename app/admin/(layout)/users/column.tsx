"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ActionButton } from "@/components/reusable/action-btn"
import { User } from "@/types/user-response.types"

const roleColors = {
  ADMIN: "bg-purple-600 text-white",
  STAFF: "bg-blue-600 text-white",
  CUSTOMER: "bg-emerald-600 text-white",
}

export function getUserColumns(): ColumnDef<User>[] {
  return [
    {
      id: "sn",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">
            {row.original.firstName} {row.original.lastName}
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            {row.original.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge className={roleColors[row.original.role]}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      id: "membership",
      header: "Membership",
      cell: ({ row }) => {
        const mem = row.original.membership
        if (!mem) return <span className="text-muted-foreground">No Plan</span>

        return (
          <div>
            <p className="font-medium capitalize">{mem.plan.toLowerCase()}</p>
            <p className="text-xs text-emerald-600">{mem.discountPct}% off</p>
          </div>
        )
      },
    },
    {
      id: "bookings",
      header: "Bookings",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original._count.bookings}
        </div>
      ),
    },
    {
      accessorKey: "isEmailVerified",
      header: "Verified",
      cell: ({ row }) => (
        <Badge variant={row.original.isEmailVerified ? "default" : "secondary"}>
          {row.original.isEmailVerified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined On",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionButton<User>
          row={row.original}
          edit={{ key: "EDIT_USER" }}
          delete={{ type: "user" }}
          view={{
            onPageUrl: `/admin/users`,
          }}
        />
      ),
    },
  ]
}
