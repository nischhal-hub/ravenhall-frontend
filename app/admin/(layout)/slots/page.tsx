"use client"
import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/reusable/data-table"
import { useModalContext } from "@/components/context/modal-context"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { useSlots } from "@/services/queries/slot.query"
import { getslotColumns } from "./column"

export default function SlotTable() {
  const { openModal } = useModalContext()
  const { data, isLoading, error, refetch, isRefetching } = useSlots()
  const slots = data?.slots || []
  console.log("Fetched Slots:", data) // Debug log to check fetched data

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="p-6">
          <Skeleton className="mb-4 h-12 w-full" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Failed to load slots. Please try again.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching || isRefreshing}
            className="mt-3"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Slots</h1>
          <p className="text-muted-foreground">
            Manage availability and block/unblock slots
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching || isRefreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching || isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button onClick={() => openModal({ key: "ADD_SLOT" })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Slot
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="p-1">
        <DataTable
          columns={getslotColumns}
          data={slots}
          functions={{
            search: {
              name: "lane.name", // Adjust according to your data structure
              placeholder: "Search slots by lane...",
            },
            add: {
              node: null, // Button already in header
            },
          }}
        />
      </Card>
    </div>
  )
}
