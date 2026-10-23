import Link from "next/link"
import { ChevronLeft, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

/** Sizing for buttons placed in DetailPageHeader `actions`: full-width 44px on mobile */
export const detailActionClass =
  "h-11 flex-1 px-4 text-sm md:h-8 md:flex-none md:px-3 md:text-xs"

/** Sizing for an icon-only button (e.g. a "More" menu) in the actions area */
export const detailIconActionClass = "size-11 shrink-0 md:size-8"

interface DetailPageHeaderProps {
  /** Parent list page, shown as the first breadcrumb and the back link */
  backHref: string
  backLabel: string
  title: string
  /** Shows a copy button beside the title (e.g. a booking reference) */
  copyLabel?: string
  status?: React.ReactNode
  /** Short line under the title, e.g. "Booked 3 Oct 2026" */
  meta?: React.ReactNode
  /** Rendered top-right on desktop and as a fixed bottom bar on mobile */
  actions?: React.ReactNode
  /** Explains why some actions are unavailable for the current state */
  hint?: React.ReactNode
  hintId?: string
}

export function DetailPageHeader({
  backHref,
  backLabel,
  title,
  copyLabel,
  status,
  meta,
  actions,
  hint,
  hintId,
}: DetailPageHeaderProps) {
  return (
    <header className="border-b border-border bg-background pb-4 md:sticky md:top-0 md:z-20 md:-mx-5 md:-mt-3 md:px-5 md:pt-3">
      {/* pl-10 keeps the breadcrumb clear of the fixed mobile sidebar trigger */}
      <nav aria-label="Breadcrumb" className="pl-10 md:pl-0">
        <ol className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <li>
            <Link
              href={backHref}
              className="-ml-1 inline-flex min-h-11 items-center gap-1 rounded-md px-1 font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none md:min-h-7"
            >
              <ChevronLeft className="size-4" aria-hidden />
              {backLabel}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="min-w-0 truncate">
            {title}
          </li>
        </ol>
      </nav>

      <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <h1 className="font-heading text-xl font-semibold tracking-tight break-words sm:text-2xl">
              {title}
            </h1>
            {copyLabel && <CopyButton value={title} label={copyLabel} />}
            {status}
          </div>
          {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
          {hint && (
            <p
              id={hintId}
              className="flex items-start gap-1.5 text-xs text-muted-foreground"
            >
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>{hint}</span>
            </p>
          )}
        </div>

        {actions && (
          <div
            data-mobile-action-bar
            className={cn(
              "fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-border bg-background/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur",
              "md:static md:z-auto md:shrink-0 md:flex-wrap md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
            )}
          >
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
