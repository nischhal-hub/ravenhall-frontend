"use client"

import { Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModalContext } from "@/components/context/modal-context"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PageHeader from "@/components/ui/page-header"
import { useState } from "react"
import { useSlots } from "@/services/queries/slot.query"
import { getslotColumns } from "./column"
import { ServerFilterDataTable } from "@/components/reusable/server-table"

export default function SlotTable() {
  const { openModal } = useModalContext()

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")

  const { data, isLoading, error, refetch } = useSlots({
    page,
    limit,
    search,
  })

  const slots = data?.data || []
  const meta = data?.meta

  const handleRefresh = async () => {
    await refetch()
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load slots. Please try again.
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
        title="Time Slots"
        description="View and manage lane time slot availability"
        actions={
          <>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            {/* <Button onClick={() => openModal({ key: "ADD_SLOT" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button> */}
          </>
        }
      />

      {/* Table with ServerFilterDataTable */}
      <Card className="p-6">
        <ServerFilterDataTable
          columns={getslotColumns()}
          data={slots}
          meta={
            meta
              ? {
                  totalCount: meta.total || 0,
                  page: meta.page,
                  limit: meta.limit,
                  totalPages: meta.totalPages,
                }
              : undefined
          }
          isLoading={isLoading}
          onSearch={(value) => {
            setSearch(value)
            setPage(1) // Reset to first page on search
          }}
          onPageChange={(newPage) => setPage(newPage)}
          functions={{
            search: {
              placeholder: "Search by lane...",
            },
          }}
          className="border-0 p-0 shadow-none"
        />
      </Card>
    </div>
  )
}
