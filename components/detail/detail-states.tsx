import Link from "next/link"
import { AlertTriangle, ArrowLeft, RefreshCw, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/reusable/empty-state"
import { ApiError } from "@/types/response"
import { DetailColumns, DetailLayout } from "./detail-layout"

// apiClient rejects with ApiError (see services/api/client.ts), not AxiosError
export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === 404
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (!error.status) {
      return "We couldn't reach the server. Check your connection and try again."
    }
    if (error.details?.message) return error.details.message
  }
  return "Something went wrong while loading this page."
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function SkeletonCard({ rows = 4 }: { rows?: number }) {
  return (
    <Card className="gap-0 py-0">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </Card>
  )
}

/** Mirrors DetailPageHeader + SummaryStrip + DetailColumns */
export function DetailSkeleton({
  summary = true,
  mainCards = 2,
  asideCards = 2,
}: {
  summary?: boolean
  mainCards?: number
  asideCards?: number
}) {
  return (
    <DetailLayout>
      <div role="status" aria-label="Loading details" className="space-y-5">
        <div className="space-y-3 border-b border-border pb-4">
          <Skeleton className="ml-10 h-4 w-28 md:ml-0" />
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="hidden h-8 w-36 lg:block" />
          </div>
        </div>

        {summary && (
          <Card className="py-0">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5 p-4">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </Card>
        )}

        <DetailColumns
          main={Array.from({ length: mainCards }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
          aside={
            asideCards > 0 &&
            Array.from({ length: asideCards }).map((_, i) => (
              <SkeletonCard key={i} rows={2} />
            ))
          }
        />
        <span className="sr-only">Loading…</span>
      </div>
    </DetailLayout>
  )
}

// ─── Not found / error ────────────────────────────────────────────────────────

interface DetailStateProps {
  backHref: string
  backLabel: string
}

export function DetailNotFound({
  title,
  description,
  backHref,
  backLabel,
}: DetailStateProps & { title: string; description: string }) {
  return (
    <DetailLayout className="pb-8">
      <Card className="mx-auto mt-10 max-w-md px-6">
        <EmptyState
          icon={SearchX}
          title={title}
          description={description}
          action={
            <Button asChild className="h-11 w-full text-sm md:h-9">
              <Link href={backHref}>
                <ArrowLeft />
                Back to {backLabel.toLowerCase()}
              </Link>
            </Button>
          }
        />
      </Card>
    </DetailLayout>
  )
}

export function DetailError({
  title,
  error,
  onRetry,
  isRetrying,
  backHref,
  backLabel,
}: DetailStateProps & {
  title: string
  error: unknown
  onRetry: () => void
  isRetrying?: boolean
}) {
  return (
    <DetailLayout className="pb-8">
      <Card className="mx-auto mt-10 max-w-md px-6" role="alert">
        <EmptyState
          icon={AlertTriangle}
          title={title}
          description={getErrorMessage(error)}
          action={
            <div className="flex flex-col gap-2 sm:flex-row sm:*:flex-1">
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                className="h-11 text-sm md:h-9"
              >
                <RefreshCw className={isRetrying ? "animate-spin" : ""} />
                {isRetrying ? "Retrying…" : "Try again"}
              </Button>
              <Button asChild variant="outline" className="h-11 text-sm md:h-9">
                <Link href={backHref}>Back to {backLabel.toLowerCase()}</Link>
              </Button>
            </div>
          }
        />
      </Card>
    </DetailLayout>
  )
}
