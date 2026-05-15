// services/queries/lane.query.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import type { LaneApiResponse } from "@/types/lane-response.types"

export const useLaneQuery = ({
  page = 1,
  limit = 20,
  search = "",
  type,
}: {
  page?: number
  limit?: number
  search?: string
  type?: string
}) => {
  return useQuery<LaneApiResponse, Error>({
    queryKey: ["lanes", page, limit, search, type],
    queryFn: async () => {
      const res = await apiClient.get<LaneApiResponse>("/lanes", {
        params: {
          page,
          limit,
          search,
          type,
        },
      })

      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
  })
}
