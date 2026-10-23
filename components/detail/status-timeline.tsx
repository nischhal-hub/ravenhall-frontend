import { cn } from "@/lib/utils"
import { formatDateTime12 } from "./format"

export type TimelineTone = "default" | "success" | "danger" | "muted"

export interface TimelineEvent {
  id: string
  title: string
  icon: React.ElementType
  /** ISO timestamp; omitted when we don't store one for this step */
  date?: string | null
  description?: React.ReactNode
  tone?: TimelineTone
  /** A step that hasn't happened yet ("what happens next") */
  upcoming?: boolean
}

const TONE_CLASS: Record<TimelineTone, string> = {
  default: "bg-primary/10 text-primary dark:bg-primary/15",
  success:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  danger: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  muted: "bg-muted text-muted-foreground",
}

/** Vertical, oldest-first list of what happened to a record */
export function StatusTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative">
      {events.map((event, i) => {
        const Icon = event.icon
        const isLast = i === events.length - 1

        return (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-8 bottom-0 left-3.75 w-px",
                  events[i + 1]?.upcoming
                    ? "border-l border-dashed border-border"
                    : "bg-border"
                )}
              />
            )}
            <div
              className={cn(
                "relative flex size-8 shrink-0 items-center justify-center rounded-full",
                event.upcoming
                  ? "border border-dashed border-border bg-background text-muted-foreground"
                  : TONE_CLASS[event.tone ?? "default"]
              )}
            >
              <Icon className="size-4" aria-hidden />
            </div>
            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  event.upcoming && "text-muted-foreground"
                )}
              >
                {event.upcoming && <span className="sr-only">Next: </span>}
                {event.title}
              </p>
              {event.date && (
                <p className="text-xs text-muted-foreground">
                  <time dateTime={event.date}>
                    {formatDateTime12(event.date)}
                  </time>
                </p>
              )}
              {event.description && (
                <div className="mt-1 text-xs break-words text-muted-foreground">
                  {event.description}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
