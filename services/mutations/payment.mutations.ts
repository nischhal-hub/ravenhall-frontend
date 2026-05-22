import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { toast } from "sonner"

export async function createPaymentIntentRequest(data: {
  bookingId: string
}): Promise<{ clientSecret: string }> {
  const response = await apiClient.post<{ clientSecret: string }>(
    "/payments/intent",
    data
  )
  return response.data // ← this is what gets set as `clientSecret` in Step3
}

export async function confirmPaymentRequest(data: { bookingId: string }) {
  const response = await apiClient.post("/payments/confirm", data)
  return response.data
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
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
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
  return usePaymentMutation<{ clientSecret: string }, { bookingId: string }>(
    ["payments", "intent"],
    createPaymentIntentRequest
    // No successMessage — Stripe redirects on success; toast goes on success page
  )
}

export function useConfirmPaymentMutation() {
  return usePaymentMutation(["payments", "confirm"], confirmPaymentRequest, {
    successMessage: "Payment confirmed!",
    invalidateKeys: [["bookings"], ["my-bookings"]],
  })
}
