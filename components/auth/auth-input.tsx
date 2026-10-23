import * as React from "react"
import { cn } from "@/lib/utils"

export const authInputClass =
  "h-12 w-full min-w-0 rounded-xl border border-border bg-background px-3.5 text-base text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/25 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none sm:h-11 sm:text-sm"

type AuthInputProps = React.ComponentProps<"input"> & {
  /** Decorative icon shown inside the field on the left */
  icon?: React.ElementType
}

/** Text input styled for the auth screens, with an optional leading icon */
export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    if (!Icon) {
      return (
        <input ref={ref} className={cn(authInputClass, className)} {...props} />
      )
    }
    return (
      <div className="relative">
        <Icon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={ref}
          className={cn(authInputClass, "pl-10", className)}
          {...props}
        />
      </div>
    )
  }
)
AuthInput.displayName = "AuthInput"
