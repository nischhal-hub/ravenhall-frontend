// hooks/queries/slot.queries.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/services/api/client"
import { GetSlotsResponse, SlotFilter } from "@/types/slot-response.types"

export const useSlots = (filters: SlotFilter = {}) => {
  return useQuery({
    queryKey: ["slots", filters],
    queryFn: async (): Promise<GetSlotsResponse> => {
      const { data } = await apiClient.get("admin/slots", {
        params: filters,
      })
      return data.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
