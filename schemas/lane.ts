import { z } from "zod"

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]

const laneImageSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
    "Image must be 5MB or smaller"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only JPEG, PNG, WEBP or GIF images are allowed"
  )
  .optional()

export const createLaneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),

  type: z.enum(["BATTING", "BOWLING", "GENERAL"]),

  description: z.string().max(500, "Description too long").optional(),

  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),

  hourlyRate: z.coerce.number().min(0, "Hourly rate cannot be negative"),

  image: laneImageSchema,
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
