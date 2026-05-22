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

// services/queries/slot.query.ts
export const useAvailableSlots = ({
  laneId,
  date,
}: {
  laneId: string
  date: string
}) => {
  return useQuery({
    queryKey: ["slots", laneId, date],
    queryFn: () =>
      apiClient.get(`/slots/available`, { params: { laneId, date } }),
    enabled: !!laneId && !!date,
  })
}
