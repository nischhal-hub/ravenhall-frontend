"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/reusable/data-table"
import { useModalContext } from "@/components/context/modal-context"
import { useLaneQuery } from "@/services/queries/lane.query"
import { getLaneColumns } from "./column"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw } from "lucide-react"
import { useState } from "react"

export default function LaneTable() {
  const { openModal } = useModalContext()
  const { data, isLoading, error, refetch, isRefetching } = useLaneQuery()
  console.log("Fetched Lanes:", data) // Debug log to check fetched data

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
            {[...Array(5)].map((_, i) => (
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
      <div className="flex items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load lanes. Please try again.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
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
          <h1 className="text-3xl font-bold tracking-tight">Lanes</h1>
          <p className="text-muted-foreground">
            Manage and organize your lanes
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

          <Button onClick={() => openModal({ key: "ADD_LANE" })}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lane
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="p-1">
        <DataTable
          columns={getLaneColumns()}
          data={data || []}
          functions={{
            search: {
              name: "name",
              placeholder: "Search lanes...",
            },
            add: {
              node: null, // We moved the button to header
            },
          }}
        />
      </Card>
    </div>
  )
}
