import { z } from "zod"

export const BookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
])

export const createBookingSchema = z.object({
  laneId: z.string().min(1, "Lane is required"),
  date: z.string().min(1, "Date is required"), // YYYY-MM-DD
  startTime: z.string().min(1, "Start time is required"), // HH:mm
  endTime: z.string().min(1, "End time is required"), // HH:mm
  numberOfPeople: z.number().min(1, "At least 1 person required").max(20),
  specialRequests: z.string().optional(),
  // status will be set by backend as PENDING by default
})

export type CreateBookingPayload = z.infer<typeof createBookingSchema>

export const updateBookingStatusSchema = z.object({
  status: BookingStatusEnum,
})

export type UpdateBookingStatusPayload = z.infer<
  typeof updateBookingStatusSchema
>
