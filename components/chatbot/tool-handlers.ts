import { apiClient } from "@/services/api/client"
import { getAccessToken } from "@/services/auth/token-store"
import { isAllowedRoute } from "@/lib/chatbot/routes"

/**
 * Browser-side implementations of the assistant's data tools. They reuse the
 * app's axios client, so they act as the logged-in customer and hit the same
 * public/customer endpoints the pages already use. Any failure is thrown and
 * reported back to the model as a tool error.
 */

type LaneSummary = {
  id: string
  name: string
  type: string
  capacity: number
  hourlyRate: number
  description: string | null
}

export async function searchLanes({ type }: { type?: string }) {
  const res = await apiClient.get("/lanes", {
    params: { limit: 50, ...(type && { type }) },
  })
  const lanes: LaneSummary[] = res.data?.data?.lanes ?? []
  return lanes.map((l) => ({
    id: l.id,
    name: l.name,
    type: l.type,
    capacity: l.capacity,
    hourlyRate: l.hourlyRate,
    description: l.description,
  }))
}

export async function getAvailability({
  date,
  type,
  fromTime,
  toTime,
}: {
  date: string
  type?: string
  fromTime?: string
  toTime?: string
}) {
  const res = await apiClient.get("/lanes/availability", {
    params: { date, ...(type && { type }) },
  })
  const data = res.data?.data as {
    date: string
    lanes: Array<
      LaneSummary & {
        slots: Array<{ id: string; startTime: string; endTime: string }>
      }
    >
  }

  // Kept deliberately small: the model reads every character of this, and
  // slot ids are long. It books by lane + date + start time instead.
  const lanes = data.lanes
    .map((l) => ({
      laneId: l.id,
      name: l.name,
      type: l.type,
      hourlyRate: l.hourlyRate,
      freeStartTimes: l.slots
        .map((s) => s.startTime)
        .filter(
          (t) => (!fromTime || t >= fromTime) && (!toTime || t <= toTime)
        ),
    }))
    .filter((l) => l.freeStartTimes.length > 0)

  return lanes.length
    ? { date: data.date, slotLengthMinutes: 60, lanes }
    : { date: data.date, lanes: [], note: "No free slots matching that." }
}

export async function getMembershipPlans() {
  const res = await apiClient.get("/memberships")
  return res.data?.data ?? []
}

function requireLogin() {
  if (!getAccessToken()) {
    throw new Error("The customer is not logged in.")
  }
}

export async function getMyMembership() {
  requireLogin()
  const res = await apiClient.get("/memberships/me")
  const m = res.data?.data
  if (!m) return { membership: null }
  return {
    membership: {
      plan: m.plan,
      discountPct: m.discountPct,
      startDate: m.startDate,
      endDate: m.endDate,
      isActive: m.isActive && new Date(m.endDate) > new Date(),
    },
  }
}

export type MyBooking = {
  id: string
  bookingRef: string
  status: string
  date?: string
  start?: string
  end?: string
  lane?: string
  amount: number
  paid: boolean
}

export async function fetchMyBookings(): Promise<MyBooking[]> {
  requireLogin()
  const res = await apiClient.get("/bookings/my", { params: { limit: 15 } })
  const bookings: Array<{
    id: string
    bookingRef: string
    status: string
    finalAmount: number
    payment?: { status?: string } | null
    items?: Array<{
      slot?: {
        date?: string
        startTime?: string
        endTime?: string
        lane?: { name?: string }
      }
    }>
  }> = res.data?.data?.bookings ?? []
  return bookings.map((b) => {
    const slot = b.items?.[0]?.slot
    return {
      id: b.id,
      bookingRef: b.bookingRef,
      status: b.status,
      date: slot?.date?.slice(0, 10),
      start: slot?.startTime,
      end: slot?.endTime,
      lane: slot?.lane?.name,
      amount: b.finalAmount,
      paid: b.payment?.status === "SUCCEEDED",
    }
  })
}

export async function getMyBookings() {
  return { bookings: await fetchMyBookings() }
}

/** Returns an error string when the path is not allowed, otherwise navigates. */
export function navigateTo(
  path: string,
  push: (path: string) => void
): { ok: true; path: string } | { ok: false; error: string } {
  if (!isAllowedRoute(path)) {
    return { ok: false, error: "That page is not available." }
  }
  push(path)
  return { ok: true, path }
}
