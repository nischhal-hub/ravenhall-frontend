import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient } from "../api/client"

export async function markNotificationReadRequest(id: string) {
  const response = await apiClient.patch(`/notifications/${id}/read`)
  return response.data
}

export async function markAllNotificationsReadRequest() {
  const response = await apiClient.patch("/notifications/read-all")
  return response.data
}

function useNotificationMutation<TVariables>(
  mutationKey: string[],
  mutationFn: (vars: TVariables) => Promise<unknown>
) {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, TVariables>({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong")
    },
  })
}

export function useMarkNotificationReadMutation() {
  return useNotificationMutation(
    ["notifications", "read"],
    markNotificationReadRequest
  )
}

export function useMarkAllNotificationsReadMutation() {
  return useNotificationMutation(["notifications", "read-all"], () =>
    markAllNotificationsReadRequest()
  )
}
