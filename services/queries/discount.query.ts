import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { DiscountApiResponse } from "@/types/discount-response.types"

export const useDiscountsQuery = () => {
  return useQuery<DiscountApiResponse>({
    queryKey: ["discounts"],
    queryFn: async () => {
      const res = await apiClient.get<DiscountApiResponse>("/admin/discounts")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
