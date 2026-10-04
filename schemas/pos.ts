import { z } from 'zod'

export const posPaymentMethods = ['CASH', 'CARD', 'STRIPE', 'BANK_TRANSFER', 'OTHER'] as const

export const createPosCustomerFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(6, 'Phone number must be at least 6 digits').optional().or(z.literal('')),
})

export type CreatePosCustomerFormData = z.infer<typeof createPosCustomerFormSchema>

export const calculatePosPricePayloadSchema = z.object({
  slotIds: z.array(z.string().min(1)).min(1, 'At least one slot must be selected'),
  customerId: z.string().optional(),
  discountCode: z.string().optional(),
  customDiscountPct: z.number().min(0).max(100).optional(),
  customDiscountAmount: z.number().min(0).optional(),
})

export type CalculatePosPricePayload = z.infer<typeof calculatePosPricePayloadSchema>

export const createPosBookingPayloadSchema = z.object({
  customerId: z.string().optional(),
  customer: z
    .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address').optional().or(z.literal('')),
      phone: z.string().optional(),
    })
    .optional(),
  isGuest: z.boolean().optional(),
  slotIds: z.array(z.string().min(1)).min(1, 'At least one slot is required'),
  paymentMethod: z.enum(['CASH', 'CARD', 'STRIPE', 'BANK_TRANSFER', 'OTHER']),
  paymentStatus: z.enum(['SUCCEEDED', 'PENDING']).default('SUCCEEDED'),
  discountCode: z.string().optional(),
  customDiscountPct: z.number().min(0).max(100).optional(),
  customDiscountAmount: z.number().min(0).optional(),
  discountReason: z.string().optional(),
  notes: z.string().optional(),
})

export type CreatePosBookingPayload = z.infer<typeof createPosBookingPayloadSchema>

export const completePosPaymentPayloadSchema = z.object({
  paymentMethod: z.enum(posPaymentMethods),
  amount: z.number().min(0).optional(),
  notes: z.string().optional(),
})

export type CompletePosPaymentPayload = z.infer<typeof completePosPaymentPayloadSchema>
