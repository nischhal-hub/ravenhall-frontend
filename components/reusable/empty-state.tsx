import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description?: string
  action?: React.ReactNode
  size?: "sm" | "default"
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "default",
  className,
}: EmptyStateProps) {
  const isSm = size === "sm"

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isSm ? "py-8" : "py-12",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "mb-3 flex items-center justify-center rounded-full bg-muted",
            isSm ? "h-12 w-12" : "h-14 w-14"
          )}
        >
          <Icon
            className={cn("text-muted-foreground", isSm ? "h-5 w-5" : "h-6 w-6")}
          />
        </div>
      )}
      <p className="font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4 w-full">{action}</div>}
    </div>
  )
}
