// services/queries/lane.query.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import type {
  LaneApiResponse,
  LaneByIdResponse,
} from "@/types/lane-response.types"

export const useLaneQuery = ({
  page = 1,
  limit = 20,
  search = "",
  type, // must be "BATTING" | "BOWLING" | "GENERAL" | undefined
}: {
  page?: number
  limit?: number
  search?: string
  type?: string
}) => {
  return useQuery<LaneApiResponse, Error>({
    queryKey: ["lanes", page, limit, search, type],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit }

      if (search) params.search = search
      if (type) params.type = type // send nothing when "All" selected

      const res = await apiClient.get<LaneApiResponse>("/lanes", { params })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
  })
}

// services/queries/laneById.query.ts

export const useLaneByIdQuery = (id?: string) => {
  return useQuery<LaneByIdResponse, Error>({
    queryKey: ["lane", id],
    queryFn: async () => {
      const res = await apiClient.get<LaneByIdResponse>(`/lanes/${id}`)
      return res.data
    },
    enabled: !!id, // important (prevents undefined call)
    retry: 2,
    staleTime: 1000 * 60 * 5,
  })
}
