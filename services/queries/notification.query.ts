import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { MyNotificationsResponse } from "@/types/notification-response.types"

export const useMyNotificationsQuery = () => {
  return useQuery<MyNotificationsResponse>({
    queryKey: ["notifications", "my"],
    queryFn: async () => {
      const res =
        await apiClient.get<MyNotificationsResponse>("/notifications/my")
      return res.data
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
}
