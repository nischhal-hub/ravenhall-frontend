"use client"

import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DataTable } from "@/components/reusable/data-table"
import { useModalContext } from "@/components/context/modal-context"
import { useDiscountsQuery } from "@/services/queries/discount.query"
import { getDiscountColumns } from "./column"

export default function DiscountsPage() {
  const { openModal } = useModalContext()
  const { data, isLoading, error, refetch, isRefetching } = useDiscountsQuery()

  const discounts = data?.data || []

  const handleRefresh = async () => {
    await refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card className="p-8">
          {[...Array(5)].map((_, i) => (
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
          Failed to load discounts. Please try again.
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
          <h1 className="text-xl font-bold tracking-tight">Discount Codes</h1>
          <p className="text-sm text-muted-foreground">
            Manage promotional and staff discount codes
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

          <Button onClick={() => openModal({ key: "ADD_DISCOUNT" })}>
            <Plus className="mr-2 h-4 w-4" />
            New Discount
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={getDiscountColumns()}
        data={discounts}
        functions={{
          search: {
            name: "code",
            placeholder: "Search discount codes...",
          },
        }}
      />
    </div>
  )
}
