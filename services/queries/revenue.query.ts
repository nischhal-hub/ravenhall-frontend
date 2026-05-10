import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { RevenueReport } from "@/types/revenue-response.types"

export interface RevenueQueryParams {
  groupBy?: "day" | "week" | "month"
  startDate?: string
  endDate?: string
}

export const useRevenueReport = (params: RevenueQueryParams = {}) => {
  return useQuery({
    queryKey: ["revenue-report", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        status: string
        message: string
        data: RevenueReport
      }>("/reports/revenue", {
        params: {
          groupBy: params.groupBy || "day",
          startDate: params.startDate,
          endDate: params.endDate,
        },
      })
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
}
