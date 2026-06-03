"use client"

import { useState } from "react"
import { RefreshCw, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useModalContext } from "@/components/context/modal-context"
import { useUsersQuery } from "@/services/queries/user.query"
import { getUserColumns } from "./column"
import { ServerFilterDataTable } from "@/components/reusable/server-table"

export default function UsersPage() {
  const { openModal } = useModalContext()

  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState("")

  const { data, error, refetch, isRefetching, isLoading } = useUsersQuery({
    page,
    limit,
    search,
  })

  const users = data?.data?.users || []
  const meta = data?.data?.meta

  const handleRefresh = async () => {
    await refetch()
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load users. Please try again.
        </AlertDescription>
        <Button onClick={handleRefresh} className="mt-3">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage customers, staff and administrators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {/* <Button onClick={() => openModal({ key: "ADD_USER" })}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button> */}
        </div>
      </div>

      {/* Table */}
      <Card className="p-6">
        <ServerFilterDataTable
          columns={getUserColumns()}
          data={users}
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
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          onPageChange={setPage}
          functions={{
            search: {
              placeholder: "Search by name or email...",
            },
          }}
        />
      </Card>
    </div>
  )
}
