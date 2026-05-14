"use client"

import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/reusable/data-table"
import { useModalContext } from "@/components/context/modal-context"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { getBookingColumns } from "./column"
import { useBookingsQuery } from "@/services/queries/bookings.query"

export default function BookingsPage() {
  const { openModal } = useModalContext()
  const [page, setPage] = useState(1)

  const { data, isLoading, error, refetch, isRefetching } =
    useBookingsQuery(page)

  const handleRefresh = async () => {
    await refetch()
  }

  const bookings = data?.data?.bookings || []
  const meta = data?.data?.meta

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card className="p-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="mb-4 h-20 w-full" />
          ))}
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load bookings. Please try again.
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
      <DataTable
        columns={getBookingColumns()}
        data={bookings}
        functions={{
          search: {
            name: "bookingRef",
            placeholder: "Search by booking reference...",
          },
        }}
      />
    </div>
  )
}
