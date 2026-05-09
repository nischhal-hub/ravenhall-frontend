// services/queries/lane.query.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import type { Lane, LaneApiResponse } from "@/types/lane-response.types"

export const useLaneQuery = () => {
  return useQuery<Lane[], Error>({
    queryKey: ["lanes"], // Better key name (plural)
    queryFn: async () => {
      const res = await apiClient.get<LaneApiResponse>("/lanes")
      return res.data.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
