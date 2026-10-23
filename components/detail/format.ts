import { format } from "date-fns"

// Human-friendly formatters shared by the detail pages

/** "14:30" → "2:30 PM" */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number)
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`
}

/** "Fri, 24 Oct 2026" */
export function formatLongDate(iso: string) {
  return format(new Date(iso), "EEE, d MMM yyyy")
}

/** "24 Oct 2026, 2:30 PM" */
export function formatDateTime12(iso: string) {
  return format(new Date(iso), "d MMM yyyy, h:mm a")
}

/** Minutes between two "HH:mm" times */
export function minutesBetween(start: string, end: string) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number)
    return h * 60 + m
  }
  return toMinutes(end) - toMinutes(start)
}

/** 60 → "1 hour", 90 → "1 hr 30 min", 120 → "2 hours" */
export function formatDuration(minutes: number) {
  if (minutes <= 0) return "—"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h} ${h === 1 ? "hour" : "hours"}`
  if (h === 0) return `${m} min`
  return `${h} hr ${m} min`
}

/** "PARTIALLY_REFUNDED" → "Partially refunded" */
export function humanize(value: string | null | undefined) {
  if (!value) return ""
  const text = value.replace(/_/g, " ").toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}
