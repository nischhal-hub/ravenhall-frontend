import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Mirrors the server's register rules (backend auth.validation.ts): at least
// 8 characters, one uppercase letter and one number. Nothing more is enforced.
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  { id: "number", label: "One number", test: (v: string) => /[0-9]/.test(v) },
] as const

type Strength = {
  label: string
  level: 0 | 1 | 2 | 3
  tone: string
  bar: string
}

function getStrength(value: string): Strength {
  const met = PASSWORD_RULES.filter((r) => r.test(value)).length
  if (met < PASSWORD_RULES.length) {
    return {
      label: "Too weak",
      level: met === 0 ? 0 : 1,
      tone: "text-destructive",
      bar: "bg-destructive",
    }
  }
  // All required rules pass; extra length or variety makes it stronger
  const extras = [
    value.length >= 12,
    /[a-z]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length
  return extras >= 2
    ? {
        label: "Strong",
        level: 3,
        tone: "text-emerald-700 dark:text-emerald-400",
        bar: "bg-emerald-600",
      }
    : {
        label: "Good",
        level: 2,
        tone: "text-amber-700 dark:text-amber-400",
        bar: "bg-amber-500",
      }
}

/** Live checklist of the server's password rules plus a simple strength label */
export function PasswordStrength({
  value,
  id,
}: {
  value: string
  id?: string
}) {
  const strength = getStrength(value)

  return (
    <div id={id} className="space-y-2 pt-1">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden>
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full bg-muted transition-colors motion-reduce:transition-none",
                value && strength.level >= step && strength.bar
              )}
            />
          ))}
        </div>
        <p
          className={cn(
            "text-xs font-semibold",
            value ? strength.tone : "text-muted-foreground"
          )}
        >
          {value ? strength.label : "Strength"}
          <span className="sr-only"> password</span>
        </p>
      </div>
      <ul
        className="grid gap-1 text-xs sm:grid-cols-3"
        aria-label="Password requirements"
      >
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(value)
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-1.5",
                ok
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {ok ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <Circle className="size-3 shrink-0" aria-hidden />
              )}
              {rule.label}
              <span className="sr-only">{ok ? " (done)" : " (not yet)"}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
