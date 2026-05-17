import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"

export interface RevenueQueryParams {
  groupBy?: "day" | "week" | "month" | "year"
  from?: string
  to?: string
}

export const useRevenueReport = (params: RevenueQueryParams = {}) => {
  return useQuery({
    queryKey: ["revenue-report", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/reports/revenue", {
        params: {
          groupBy: params.groupBy || "week",
          from: params.from,
          to: params.to,
        },
      })

      return data
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}
