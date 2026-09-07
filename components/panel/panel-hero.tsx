interface PanelHeroProps {
  eyebrow?: string
  eyebrowIcon?: React.ElementType
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

export function PanelHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  actions,
}: PanelHeroProps) {
  return (
    <div className="relative overflow-hidden bg-primary px-4 py-12 sm:px-8">
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {eyebrow && (
          <div className="mb-4 flex items-center gap-2">
            {EyebrowIcon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <EyebrowIcon className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
            <span className="text-xs font-bold tracking-widest text-accent uppercase">
              {eyebrow}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-primary-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-primary-foreground/60">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      </div>
    </div>
  )
}
