import { z } from "zod"

/**
 * Simplified Admin Booking Schema
 * Lane → Slot → Create Booking flow
 * No user selection needed
 */

export const createAdminBookingSimpleSchema = z.object({
  laneId: z.string().min(1, "Lane is required").describe("The lane to book"),

  slotId: z
    .string()
    .min(1, "Time slot is required")
    .describe("The time slot to book"),

  discountCode: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .refine(
      (val) => !val || /^[A-Z0-9_-]{3,20}$/.test(val),
      "Invalid discount code format"
    )
    .describe("Optional discount code"),

  notes: z
    .string()
    .trim()
    .max(500, "Notes must be 500 characters or less")
    .optional()
    .describe("Internal notes about this booking"),

  status: z
    .enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"])
    .default("PENDING")
    .describe("Booking status"),

  sendConfirmation: z
    .boolean()
    .default(true)
    .describe("Send confirmation email"),
})

export type CreateAdminBookingSimplePayload = z.infer<
  typeof createAdminBookingSimpleSchema
>

/**
 * Alternative if you need userId for backend
 * Add this field if your backend requires userId
 */
export const createAdminBookingWithUserSchema = z.object({
  laneId: z.string().min(1, "Lane is required"),

  slotId: z.string().min(1, "Time slot is required"),
})

export type CreateAdminBookingWithUserPayload = z.infer<
  typeof createAdminBookingWithUserSchema
>
