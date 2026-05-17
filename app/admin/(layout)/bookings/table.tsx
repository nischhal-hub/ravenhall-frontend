"use client"

import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModalContext } from "@/components/context/modal-context"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { getBookingColumns } from "./column"
import { useBookingsQuery } from "@/services/queries/bookings.query"
import { ServerFilterDataTable } from "@/components/reusable/server-table"

export default function BookingsPage() {
  const { openModal } = useModalContext()

  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState("")

  const { data, isLoading, error, refetch, isRefetching } = useBookingsQuery({
    page,
    limit,
    search,
  })

  const bookings = data?.data?.bookings || []
  const meta = data?.data?.meta

  const handleRefresh = async () => {
    await refetch()
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load bookings. Please try again.
        </AlertDescription>
        <Button onClick={handleRefresh} className="mt-3" variant="outline">
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
          <h1 className="text-xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage all customer bookings and sessions
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

          <Button onClick={() => openModal({ key: "ADD_BOOKING" })}>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="p-6">
        <ServerFilterDataTable
          columns={getBookingColumns()}
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
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          onPageChange={setPage}
          functions={{
            search: {
              placeholder: "Search by booking reference, customer name...",
            },
          }}
        />
      </Card>
    </div>
  )
}
