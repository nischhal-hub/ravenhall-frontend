import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { UsersApiResponse } from "@/types/user-response.types"

export const useUsersQuery = (page = 1, limit = 20, search = "") => {
  return useQuery<UsersApiResponse>({
    queryKey: ["users", page, limit, search],
    queryFn: async () => {
      const res = await apiClient.get<UsersApiResponse>("/admin/users", {
        params: { page, limit, search },
      })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 3, // 3 minutes
  })
}
