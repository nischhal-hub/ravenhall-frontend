import { z } from "zod"

export const BookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
])

// Body of POST /bookings (the API derives lane, date and price from the slot)
export const createBookingSchema = z.object({
  slotId: z.string().min(1, "Slot is required"),
  duration: z.number().int().min(1).max(3).optional(),
  discountCode: z.string().optional(),
})

export type CreateBookingPayload = z.infer<typeof createBookingSchema>

export const updateBookingStatusSchema = z.object({
  status: BookingStatusEnum,
})

export type UpdateBookingStatusPayload = z.infer<
  typeof updateBookingStatusSchema
>
