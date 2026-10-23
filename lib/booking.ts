import { Slot } from "@/types/lane-response.types"

export const EQUIPMENT_FEE = 10

const isFree = (slot: Slot) => slot.isAvailable && !slot.isBlocked

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * True once a slot's start time has arrived, on the viewer's local clock.
 * `slot.date` is the calendar day ("YYYY-MM-DD…") and `startTime` is "HH:mm",
 * both in the centre's local time, so plain string comparison is enough.
 */
export function isSlotPast(slot: Slot, now: Date) {
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const day = slot.date.slice(0, 10)
  if (day !== today) return day < today
  return slot.startTime <= `${pad(now.getHours())}:${pad(now.getMinutes())}`
}

/** Free to book right now: not booked, not blocked, not already started */
export const isBookable = (slot: Slot, now: Date) =>
  isFree(slot) && !isSlotPast(slot, now)

/**
 * Returns the `duration` back-to-back free slots starting at `start`, or null
 * if the session doesn't fit (a booked/blocked slot or a gap in between).
 * `daySlots` must all belong to the same lane and day.
 */
export function getSlotRange(
  daySlots: Slot[],
  start: Slot,
  duration: number
): Slot[] | null {
  const sorted = [...daySlots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )
  const from = sorted.findIndex((s) => s.id === start.id)
  if (from === -1) return null

  const range: Slot[] = []
  for (let i = 0; i < duration; i++) {
    const slot = sorted[from + i]
    const prev = range[range.length - 1]
    if (!slot || !isFree(slot)) return null
    if (prev && prev.endTime !== slot.startTime) return null
    range.push(slot)
  }
  return range
}

const round2 = (n: number) => Math.round(n * 100) / 100

export interface BookingPrice {
  laneHire: number
  memberDiscount: number
  promoDiscount: number
  equipmentFee: number
  /** laneHire + equipmentFee, before any discount */
  gross: number
  /** gross - memberDiscount - promoDiscount, never below 0 */
  total: number
}

/**
 * Single source of truth for booking money — used by every step so the
 * numbers can't drift. The member % applies to lane hire only; the promo is a
 * flat amount capped at what's left of the lane hire.
 */
export function calculateBookingPrice({
  hourlyRate,
  duration,
  memberDiscountPct = 0,
  promoDiscount = 0,
}: {
  hourlyRate: number
  duration: number
  memberDiscountPct?: number
  promoDiscount?: number
}): BookingPrice {
  const laneHire = round2(hourlyRate * duration)
  const memberDiscount = round2((laneHire * memberDiscountPct) / 100)
  const promo = round2(Math.min(promoDiscount, laneHire - memberDiscount))
  const gross = round2(laneHire + EQUIPMENT_FEE)
  const total = round2(gross - memberDiscount - promo)

  return {
    laneHire,
    memberDiscount,
    promoDiscount: promo,
    equipmentFee: EQUIPMENT_FEE,
    gross,
    total,
  }
}
