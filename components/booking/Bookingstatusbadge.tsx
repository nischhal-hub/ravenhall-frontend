"use client"

interface BookingStatusBadgeProps {
  status: string
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-accent text-accent-foreground",
  PENDING: "bg-secondary text-secondary-foreground",
  CANCELLED: "bg-destructive text-white",
  COMPLETED: "bg-muted text-muted-foreground",
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const cls = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
