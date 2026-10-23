import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

interface InfoCardProps {
  title: string
  icon?: React.ElementType
  description?: string
  /** Optional control on the right of the heading */
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** A titled section card used to group related details */
export function InfoCard({
  title,
  icon: Icon,
  description,
  action,
  children,
  className,
}: InfoCardProps) {
  const headingId = `section-${title.toLowerCase().replace(/\W+/g, "-")}`

  return (
    <Card
      className={cn("gap-0 py-0", className)}
      role="region"
      aria-labelledby={headingId}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Icon className="size-3.5 text-muted-foreground" aria-hidden />
            </div>
          )}
          <div className="min-w-0">
            <h2 id={headingId} className="text-sm font-semibold">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <CardContent className="px-4 py-4">{children}</CardContent>
    </Card>
  )
}

/** Grid of InfoRows; two columns from the sm breakpoint unless `columns={1}` */
export function InfoList({
  children,
  columns = 2,
}: {
  children: React.ReactNode
  columns?: 1 | 2
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-4",
        columns === 2 && "sm:grid-cols-2"
      )}
    >
      {children}
    </dl>
  )
}

interface InfoRowProps {
  label: string
  value?: React.ReactNode
  /** Adds a copy button for this raw value */
  copyValue?: string
  mono?: boolean
  /** Span both columns of an InfoList */
  full?: boolean
}

function isEmpty(value: React.ReactNode) {
  return value === null || value === undefined || value === ""
}

/** Muted label above a readable value; empty values render as "—" */
export function InfoRow({ label, value, copyValue, mono, full }: InfoRowProps) {
  return (
    <div className={cn("min-w-0", full && "sm:col-span-2")}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex min-w-0 items-center gap-1 text-sm font-medium text-foreground">
        {isEmpty(value) ? (
          <span className="text-muted-foreground">
            <span aria-hidden>—</span>
            <span className="sr-only">Not provided</span>
          </span>
        ) : (
          <span
            className={cn(
              "min-w-0 break-words",
              mono && "font-mono text-xs break-all"
            )}
          >
            {value}
          </span>
        )}
        {copyValue && <CopyButton value={copyValue} label={label} />}
      </dd>
    </div>
  )
}

/** Label/amount line for price breakdowns */
export function AmountRow({
  label,
  value,
  emphasis,
  className,
}: {
  label: React.ReactNode
  value: React.ReactNode
  emphasis?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4",
        emphasis ? "text-base font-semibold" : "text-sm",
        className
      )}
    >
      <span className={cn(!emphasis && "text-muted-foreground")}>{label}</span>
      <span className="text-right font-medium tabular-nums">{value}</span>
    </div>
  )
}
