"use client"

import { RefreshCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DataTable } from "@/components/reusable/data-table"
import { useMembershipPlansQuery } from "@/services/queries/membership.query"
import { getMembershipColumns } from "./column"

export default function MembershipPlansPage() {
  const { data, isLoading, error, refetch, isRefetching } =
    useMembershipPlansQuery()

  const plans = data?.data || []

  const handleRefresh = async () => {
    await refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Card className="p-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="mb-4 h-24 w-full" />
          ))}
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load membership plans.</AlertDescription>
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
          <h1 className="text-3xl font-bold tracking-tight">
            Membership Plans
          </h1>
          <p className="text-muted-foreground">
            Configure available membership tiers and benefits
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

          <Button onClick={() => alert("Add new plan coming soon...")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="p-1">
        <DataTable
          columns={getMembershipColumns()}
          data={plans}
          functions={{
            search: {
              name: "plan",
              placeholder: "Search membership plans...",
            },
          }}
        />
      </Card>
    </div>
  )
}
