import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  step: number
}

export function StepIndicator({ step }: StepIndicatorProps) {
  const steps = [
    { n: 1, label: "Select Slot" },
    { n: 2, label: "Review & Discount" },
    { n: 3, label: "Payment" },
  ]

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                step > s.n
                  ? "border-accent bg-accent text-accent-foreground"
                  : step === s.n
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground"
              )}
            >
              {step > s.n ? <CheckCircle2 className="size-4" /> : s.n}
            </div>
            <span
              className={cn(
                "hidden text-[10px] font-medium whitespace-nowrap sm:block",
                step === s.n ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-1 mb-4 h-0.5 w-16 transition-colors sm:w-24",
                step > s.n ? "bg-accent" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
