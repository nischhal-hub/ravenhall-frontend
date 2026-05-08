import Link from "next/link"
import type { ReactNode } from "react"

type ComingSoonPageProps = {
  title: string
  description?: string
  icon?: ReactNode
  eta?: string
}

export default function ComingSoonPage({
  title,
  description = "This section is under active development and will be available soon.",
  icon,
  eta = "Launching soon",
}: ComingSoonPageProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_40%)] opacity-10" />

      <div className="relative grid gap-4 sm:gap-5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-primary" />
          {eta}
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-border/70 bg-background p-3 text-primary">
            {icon ?? (
              <span
                className="inline-block text-base font-semibold"
                aria-hidden="true"
              >
                LS
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="mt-1 text-sm font-medium">
              Planning and implementation
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Focus</p>
            <p className="mt-1 text-sm font-medium">
              UI, data flow and validation
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4 sm:col-span-2 xl:col-span-1">
            <p className="text-xs text-muted-foreground">Access</p>
            <p className="mt-1 text-sm font-medium">Admins only</p>
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}
