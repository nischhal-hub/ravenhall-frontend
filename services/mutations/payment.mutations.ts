import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { toast } from "sonner"

export interface PaymentIntentResult {
  clientSecret: string
  /** The amount Stripe will charge, from the server */
  amount: number
  currency: string
}

/** Starts or resumes checkout for a PENDING booking (the server reuses its PaymentIntent) */
export async function createPaymentIntentRequest(data: {
  bookingId: string
}): Promise<PaymentIntentResult> {
  const response = await apiClient.post<{ data: PaymentIntentResult }>(
    "/payments/intent",
    data
  )
  return response.data.data
}

export type PaymentOutcome = "paid" | "processing" | "failed" | "unpaid"

export interface ConfirmPaymentResult {
  bookingId: string
  bookingRef: string
  outcome: PaymentOutcome
}

/** Asks the server to check the payment with Stripe after the customer returns */
export async function confirmPaymentRequest(data: {
  bookingId: string
}): Promise<ConfirmPaymentResult> {
  const response = await apiClient.post<{ data: ConfirmPaymentResult }>(
    "/payments/confirm",
    data
  )
  return response.data.data
}

export interface CheckoutPayload {
  slotId: string
  duration: number
  discountCode?: string
}

export interface CheckoutResult extends PaymentIntentResult {
  paymentIntentId: string
  /** Lane hire + equipment fee, before discounts */
  totalAmount: number
  discountAmount: number
  discountPct: number
  /** The promo code the server applied (null if the member discount was better) */
  discountCode: string | null
}

/**
 * Starts paying for a new booking. Nothing is booked yet: the server only
 * creates the booking once the payment succeeds.
 */
export async function startCheckoutRequest(
  data: CheckoutPayload
): Promise<CheckoutResult> {
  const response = await apiClient.post<{ data: CheckoutResult }>(
    "/payments/checkout",
    data
  )
  return response.data.data
}

export interface ConfirmCheckoutResult {
  /** "refunded": paid, but the slot was taken meanwhile, so no booking was made */
  outcome: PaymentOutcome | "refunded"
  bookingId: string | null
  bookingRef: string | null
}

/** After returning from Stripe: the server creates the booking if it's paid */
export async function confirmCheckoutRequest(data: {
  paymentIntentId: string
}): Promise<ConfirmCheckoutResult> {
  const response = await apiClient.post<{ data: ConfirmCheckoutResult }>(
    "/payments/checkout/confirm",
    data
  )
  return response.data.data
}

// ─────────────────────────────────────────────
// Generic mutation factory
// ─────────────────────────────────────────────

function usePaymentMutation<TData, TVariables>(
  mutationKey: string[],
  mutationFn: (vars: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void
    successMessage?: string
    invalidateKeys?: string[][]
  }
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationKey,
    mutationFn,
    onSuccess: (data) => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        )
      }
      if (options?.successMessage) {
        toast.success(options.successMessage)
      }
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      const message =
        error.message ||
        "Payment failed. Please try again."
      toast.error(message)
    },
  })
}

// ─────────────────────────────────────────────
// Exported hooks
// ─────────────────────────────────────────────

export function useCreatePaymentIntentMutation() {
  return usePaymentMutation<PaymentIntentResult, { bookingId: string }>(
    ["payments", "intent"],
    createPaymentIntentRequest
    // No successMessage — Stripe redirects on success; toast goes on success page
  )
}

export function useStartCheckoutMutation() {
  return usePaymentMutation<CheckoutResult, CheckoutPayload>(
    ["payments", "checkout"],
    startCheckoutRequest
  )
}

export function useConfirmPaymentMutation() {
  return usePaymentMutation(["payments", "confirm"], confirmPaymentRequest, {
    invalidateKeys: [["bookings"], ["booking"], ["notifications"]],
  })
}
