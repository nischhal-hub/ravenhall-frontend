interface PanelHeroProps {
  eyebrow?: string
  eyebrowIcon?: React.ElementType
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * Page header for the customer panel. Deliberately low-contrast: the card
 * surface with a faint pitch-green tint, so the page content stays the focus.
 */
export function PanelHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  actions,
}: PanelHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-linear-to-br from-primary/8 via-card to-card px-4 py-10 sm:px-8 dark:from-primary/10">
      <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-highlight/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {eyebrow && (
          <div className="mb-3 flex items-center gap-2">
            {EyebrowIcon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
                <EyebrowIcon className="h-4 w-4 text-primary dark:text-rose-400" />
              </div>
            )}
            <span className="text-xs font-semibold tracking-widest text-primary uppercase dark:text-rose-400">
              {eyebrow}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          )}
        </div>
      </div>
    </div>
  )
}
