import { z } from "zod"

export const createDiscountCodeSchema = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be at most 20 characters")
      .regex(
        /^[A-Z0-9]+$/,
        "Code can only contain uppercase letters and numbers"
      )
      .transform((val) => val.toUpperCase()),

    description: z
      .string()
      .max(200, "Description must be at most 200 characters")
      .optional(),

    discountPct: z
      .number()
      .min(0.01, "Discount must be at least 0.01%")
      .max(100, "Discount cannot exceed 100%"),

    maxUses: z.coerce
      .number()
      .int("Max uses must be a whole number")
      .min(1, "Max uses must be at least 1")
      .optional(),

    validFrom: z.string().min(1, "Start date is required"),
    validTo: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      const from = new Date(data.validFrom)
      const to = new Date(data.validTo)
      return to > from
},
    {
      message: "End date must be after start date",
      path: ["validTo"],
    }
  )

export type CreateDiscountCodeFormValues = z.infer<
  typeof createDiscountCodeSchema
>
export type CreateDiscountCodePayload = CreateDiscountCodeFormValues
