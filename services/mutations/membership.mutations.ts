import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// API Requests
// ─────────────────────────────────────────────

export async function createMembershipPaymentIntentRequest(data: {
  plan: string
}): Promise<{ clientSecret: string; paymentId: string }> {
  const response = await apiClient.post("/memberships/payment/intent", data)
  return response.data
}

export async function confirmMembershipPaymentRequest(data: {
  paymentIntentId: string
}) {
  const response = await apiClient.post("/memberships/payment/confirm", data)
  return response.data
}

// ─────────────────────────────────────────────
// Generic Hook
// ─────────────────────────────────────────────

function useMembershipPaymentMutation<TData, TVariables>(
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
      const message = error?.response?.data?.message || "Payment failed"
      toast.error(message)
    },
  })
}

// ─────────────────────────────────────────────
// Exported Hooks
// ─────────────────────────────────────────────

export function useCreateMembershipPaymentIntent() {
  return useMembershipPaymentMutation(
    ["membership", "payment", "intent"],
    createMembershipPaymentIntentRequest
  )
}

export function useConfirmMembershipPayment() {
  return useMembershipPaymentMutation(
    ["membership", "payment", "confirm"],
    confirmMembershipPaymentRequest,
    {
      successMessage: "Membership activated successfully!",
      invalidateKeys: [["my-membership"]],
    }
  )
}
