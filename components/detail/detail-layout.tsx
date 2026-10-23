import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** Page wrapper: width cap, spacing and room for the mobile action bar */
export function DetailLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl space-y-5 pb-28 md:pb-8",
        className
      )}
    >
      {children}
    </div>
  )
}

/** Main content plus a side column on desktop; one stacked column below lg */
export function DetailColumns({
  main,
  aside,
}: {
  main: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
      <div className="min-w-0 space-y-5">{main}</div>
      {aside && <aside className="min-w-0 space-y-5">{aside}</aside>}
    </div>
  )
}

export interface SummaryItem {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  /** Smaller supporting text under the value */
  sub?: React.ReactNode
}

/** The at-a-glance facts shown right under the header */
export function SummaryStrip({ items }: { items: SummaryItem[] }) {
  return (
    <Card className="py-0">
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, value, sub }, i) => (
          <div
            key={label}
            className={cn(
              "flex min-w-0 gap-3 border-border p-4",
              // inner borders for a 2-col grid on mobile and 4-col on desktop
              i % 2 === 1 && "border-l",
              i >= 2 && "border-t lg:border-t-0",
              i > 0 && "lg:border-l"
            )}
          >
            <div className="hidden size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:flex dark:bg-primary/15">
              <Icon className="size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-sm font-semibold break-words text-foreground">
                {value}
              </dd>
              {sub && <dd className="text-xs text-muted-foreground">{sub}</dd>}
            </div>
          </div>
        ))}
      </dl>
    </Card>
  )
}
