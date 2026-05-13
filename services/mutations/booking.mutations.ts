import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { toast } from "sonner"
import { CreateBookingPayload } from "@/schemas/booking"


// ================== REQUEST FUNCTIONS ==================

export async function createBookingRequest(data: CreateBookingPayload) {
  const response = await apiClient.post("/bookings", data)
  return response.data
}

export async function cancelBookingRequest(id: string) {
  const response = await apiClient.patch(`/bookings/${id}/cancel`)
  return response.data
}

export async function updateBookingStatusRequest({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const response = await apiClient.patch(`/admin/bookings/${id}/status`, { status })
  return response.data
}

export async function deleteBookingRequest(id: string) {
  const response = await apiClient.delete(`/bookings/${id}`)
  return response.data
}

// ================== REUSABLE MUTATION HOOK ==================

function useBookingMutation<TData, TVariables>(
  mutationKey: string[],
  mutationFn: (vars: TVariables) => Promise<TData>,
  successMessage: string
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })

      toast.success(successMessage)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong"
      toast.error(message)
    },
  })
}

// ================== EXPORTED HOOKS ==================

export function useCreateBookingMutation() {
  return useBookingMutation(
    ["bookings", "create"],
    createBookingRequest,
    "Booking created successfully"
  )
}

export function useCancelBookingMutation() {
  return useBookingMutation(
    ["bookings", "cancel"],
    cancelBookingRequest,
    "Booking cancelled successfully"
  )
}

export function useUpdateBookingStatusMutation() {
  return useBookingMutation(
    ["bookings", "status"],
    updateBookingStatusRequest,
    "Booking status updated successfully"
  )
}

export function useDeleteBookingMutation() {
  return useBookingMutation(
    ["bookings", "delete"],
    deleteBookingRequest,
    "Booking deleted successfully"
  )
}
