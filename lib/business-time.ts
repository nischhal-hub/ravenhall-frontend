// Dates and times as the centre sees them. Slot times ("14:00") are wall-clock
// times in the business timezone, so "today", "has it started" and every
// displayed timestamp use that zone, never the viewer's browser zone. Keep
// NEXT_PUBLIC_BUSINESS_TIMEZONE equal to the API's BUSINESS_TIMEZONE.

export const BUSINESS_TIME_ZONE =
  process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE || "Asia/Kathmandu"

const LOCALE = "en-AU"
const pad = (n: number) => String(n).padStart(2, "0")

const clockFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

/** The business-timezone calendar day ("YYYY-MM-DD") and time ("HH:mm") of an instant */
export function businessClock(instant: Date = new Date()) {
  const parts = Object.fromEntries(
    clockFormat.formatToParts(instant).map((p) => [p.type, p.value])
  )
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    year: Number(parts.year),
    /** 0-based, like Date#getMonth */
    month: Number(parts.month) - 1,
    day: Number(parts.day),
  }
}

/** Today's date ("YYYY-MM-DD") at the centre */
export const businessToday = (now: Date = new Date()) => businessClock(now).date

/** Formats a timestamp (createdAt, paidAt…) in the business timezone */
export function formatInstant(
  value: string | Date,
  options: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: BUSINESS_TIME_ZONE,
    ...options,
  }).format(new Date(value))
}

/**
 * Formats a calendar day: a slot's `date` ("YYYY-MM-DD" or the API's
 * "YYYY-MM-DDT00:00:00.000Z"). It is a day, not an instant, so it is read as
 * written and never shifted by any timezone.
 */
export function formatCalendarDate(
  value: string,
  options: Intl.DateTimeFormatOptions
) {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number)
  return new Intl.DateTimeFormat(LOCALE, { timeZone: "UTC", ...options }).format(
    new Date(Date.UTC(y, m - 1, d))
  )
}

/** "YYYY-MM-DD" for a calendar day `days` after `date` */
export function addCalendarDays(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + days))
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`
}

/** "Kathmandu time" — for labelling slot times */
export const BUSINESS_TIME_LABEL = `${
  BUSINESS_TIME_ZONE.split("/").pop()?.replace(/_/g, " ") ?? BUSINESS_TIME_ZONE
} time`
