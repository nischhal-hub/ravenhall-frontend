import { z } from "zod"

export const createLaneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),

  type: z.enum(["BATTING", "BOWLING", "GENERAL"]),

  description: z.string().max(500, "Description too long").optional(),

  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),

  hourlyRate: z.coerce.number().min(0, "Hourly rate cannot be negative"),

  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
})
export const updateLaneSchema = createLaneSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export type CreateLaneFormValues = z.infer<typeof createLaneSchema>
export type UpdateLaneFormValues = z.infer<typeof updateLaneSchema>

export type CreateLanePayload = CreateLaneFormValues
export type UpdateLanePayload = {
  id: string
} & UpdateLaneFormValues
