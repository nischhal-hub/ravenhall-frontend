/* eslint-disable react-hooks/incompatible-library */
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TableMeta {
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: TableMeta
  isLoading?: boolean
  onSearch?: (value: string) => void
  onPageChange?: (page: number) => void
  functions?: {
    search?: { placeholder?: string }
    add?: { node: React.ReactNode }
  }
  className?: string
}

const TableSkeletonRow = ({ columns }: { columns: any[] }) => (
  <TableRow>
    {columns.map((_, i) => (
      <TableCell key={i} className="py-4">
        <Skeleton className="h-5 w-full max-w-45 rounded" />
      </TableCell>
    ))}
  </TableRow>
)

export function ServerFilterDataTable<TData, TValue>({
  columns,
  data,
  meta,
  onSearch,
  onPageChange,
  functions,
  isLoading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={cn("space-y-5", className)}>
      {/* Search + Actions Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {functions?.search && (
          <div className="w-full sm:w-80">
            <Input
              placeholder={functions.search.placeholder || "Search..."}
              onChange={(e) => onSearch?.(e.target.value)}
              className="h-10 shadow-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-3">{functions?.add?.node}</div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-none bg-card shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b hover:bg-muted/50"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-12 px-4 text-left text-sm font-semibold text-foreground/90",
                        "whitespace-nowrap" // Prevent header text from wrapping
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: meta?.limit || 8 }).map((_, i) => (
                  <TableSkeletonRow key={i} columns={columns} />
                ))
              ) : data.length > 0 ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "border-b transition-colors last:border-0",
                      i % 2 === 0 ? "bg-background" : "bg-muted/20",
                      "hover:bg-muted/60"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-4 text-sm",
                          "max-w-75 wrap-break-word" // Limit width & wrap text
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-48 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-lg font-medium">No results found</p>
                      <p className="text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center">
          <div className="text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.totalCount)}
            </span>{" "}
            of <span className="font-medium">{meta.totalCount}</span> results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(meta.page - 1)}
              disabled={meta.page === 1 || isLoading}
              className="h-9 px-4"
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(meta.page + 1)}
              disabled={meta.page === meta.totalPages || isLoading}
              className="h-9 px-4"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
