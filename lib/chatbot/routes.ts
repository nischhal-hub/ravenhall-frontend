/**
 * Pages the assistant is allowed to send a customer to. Shared by the server
 * (so the model knows what exists) and the browser (which validates the path
 * before navigating, so a bad model output can never push to an arbitrary URL).
 */
export const STATIC_ROUTES = [
  { path: "/", label: "Home" },
  { path: "/lanes", label: "Browse all lanes and start a booking" },
  { path: "/membership", label: "Membership plans" },
  { path: "/about", label: "About the centre, contact and opening hours" },
  { path: "/auth", label: "Log in" },
  { path: "/auth/register", label: "Create an account" },
  { path: "/panel", label: "Customer dashboard (login required)" },
  { path: "/panel/bookings", label: "My bookings (login required)" },
  { path: "/panel/membership", label: "My membership (login required)" },
  { path: "/panel/notification", label: "Notifications (login required)" },
  { path: "/panel/settings", label: "Account settings (login required)" },
] as const

const LANE_PAGE = /^\/lanes\/[A-Za-z0-9_-]+$/

export function isAllowedRoute(path: string) {
  return STATIC_ROUTES.some((r) => r.path === path) || LANE_PAGE.test(path)
}

/** Deep link into the booking page with a date and slot pre-selected. */
export function bookingUrl(laneId: string, date: string, slotId: string) {
  const qs = new URLSearchParams({ date, slotId })
  return `/lanes/${encodeURIComponent(laneId)}?${qs.toString()}`
}
