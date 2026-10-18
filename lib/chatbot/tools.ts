import { tool } from "ai"
import { z } from "zod"

/**
 * Tool definitions for the customer assistant.
 *
 * None of these have an `execute` on purpose: they run in the browser
 * (see components/chatbot/tool-handlers.ts) so every call goes through the
 * existing axios client with the logged-in customer's own token, and the
 * booking / cancel tools can ask the customer to confirm before anything
 * changes.
 */

const laneType = z
  .enum(["BATTING", "BOWLING", "GENERAL"])
  .describe("Lane type filter")

export const chatTools = {
  searchLanes: tool({
    description:
      "List the bookable lanes with their id, type, capacity and hourly rate. Optionally filter by type.",
    inputSchema: z.object({ type: laneType.optional() }),
  }),

  getAvailability: tool({
    description:
      "Find free one-hour slots on a given date across all lanes (or one type). Returns, per lane, the laneId, hourly rate and the free start times. Use fromTime/toTime to narrow to a part of the day (for example evening = 17:00 to 22:00).",
    inputSchema: z.object({
      date: z.string().describe("Date as YYYY-MM-DD, in the centre's timezone"),
      type: laneType.optional(),
      fromTime: z
        .string()
        .optional()
        .describe("Earliest start time, HH:mm (24h), inclusive"),
      toTime: z
        .string()
        .optional()
        .describe("Latest start time, HH:mm (24h), inclusive"),
    }),
  }),

  getMembershipPlans: tool({
    description: "List membership plans with price and booking discount.",
    inputSchema: z.object({}),
  }),

  getMyMembership: tool({
    description:
      "Get the logged-in customer's current membership. Returns an error if the customer is not logged in.",
    inputSchema: z.object({}),
  }),

  getMyBookings: tool({
    description:
      "Get the logged-in customer's most recent bookings (reference, status, lane, date, time, amount, id). Returns an error if not logged in.",
    inputSchema: z.object({}),
  }),

  navigate: tool({
    description:
      "Take the customer to a page on the site. Only use paths from the allowed page list in your instructions, or /lanes/<laneId> for a specific lane.",
    inputSchema: z.object({
      path: z.string().describe("Site path, e.g. /membership or /lanes/abc123"),
    }),
  }),

  proposeBooking: tool({
    description:
      "Show the customer a booking card for a specific free slot with a button that opens the booking page with that slot pre-selected (they review, add a promo code and pay there). Nothing is booked or charged by this tool. Use only a laneId and a start time returned by getAvailability.",
    inputSchema: z.object({
      laneId: z.string(),
      date: z.string().describe("YYYY-MM-DD of the slot"),
      startTime: z.string().describe("Slot start time, HH:mm (24h)"),
    }),
    // What the customer did with the card, reported back by the browser.
    outputSchema: z.string(),
  }),

  proposeCancelBooking: tool({
    description:
      "Show the customer a card asking them to confirm cancelling one of their bookings. The booking is only cancelled if they press Confirm. Use a bookingId returned by getMyBookings.",
    inputSchema: z.object({ bookingId: z.string() }),
    outputSchema: z.string(),
  }),
}

export type ChatToolName = keyof typeof chatTools
