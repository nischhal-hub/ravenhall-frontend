"use client"

import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModalContext } from "@/components/context/modal-context"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PageHeader from "@/components/ui/page-header"
import { useState } from "react"
import { useLaneQuery } from "@/services/queries/lane.query"
import { ServerFilterDataTable } from "@/components/reusable/server-table"
import { getLaneColumns } from "../lanes/column"

export default function LanesPage() {
  const { openModal } = useModalContext()

  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState("")

  const { data, isLoading, error, refetch, isRefetching } = useLaneQuery({
    page,
    limit,
    search,
  })

  const lanes = data?.data?.lanes || []
  const meta = data?.data?.meta

  const handleRefresh = async () => {
    await refetch()
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load lanes. Please try again.
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
        title="Lanes"
        description="Manage bowling lanes and configurations"
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

            <Button onClick={() => openModal({ key: "ADD_LANE" })}>
              <Plus className="mr-2 h-4 w-4" />
              New Lane
            </Button>
          </>
        }
      />

      {/* Table */}
      <Card className="p-6">
        <ServerFilterDataTable
          columns={getLaneColumns()}
          data={lanes}
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
          functions={
            // cast to any because ServerFilterDataTable's functions prop
            // type doesn't include our custom 'filter' property
            {
              search: {
                placeholder: "Search lanes by name...",
              },
            }
          }
        />
      </Card>
    </div>
  )
}
