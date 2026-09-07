"use client"

import { RefreshCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import PageHeader from "@/components/ui/page-header"
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load membership plans. Please try again.
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
      <PageHeader
        size="lg"
        title="Membership Plans"
        description="Configure available membership tiers and benefits"
        actions={
          <>
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

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
          </>
        }
      />

      {/* Table */}
      <DataTable
        columns={getMembershipColumns()}
        data={plans}
        isLoading={isLoading}
        functions={{
          search: {
            name: "plan",
            placeholder: "Search membership plans...",
          },
        }}
      />
    </div>
  )
}
