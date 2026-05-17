import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/services/api/client"
import { GetSlotsResponse, SlotFilter } from "@/types/slot-response.types"

export const useSlots = (filters: SlotFilter = {}) => {
  return useQuery({
    queryKey: [
      "slots",
      filters.page,
      filters.limit,
      filters.date,
      filters.laneId,
      filters.isBlocked,
      filters.search,
    ],

    queryFn: async (): Promise<GetSlotsResponse> => {
      const { data } = await apiClient.get("/admin/slots", {
        params: filters,
      })

      return data.data
    },

    staleTime: 1000 * 60 * 5,
  })
}
