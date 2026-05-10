import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { DashboardData } from "@/types/dashboard-response"

export const useDashboardQuery = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<{
        status: string
        message: string
        data: DashboardData
      }>("/admin/dashboard")

      return response.data.data
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    refetchInterval: 1000 * 60 * 5, // Auto refresh every 5 minutes
    retry: 2,
  })
}
