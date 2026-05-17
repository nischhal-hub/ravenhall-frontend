import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import {
  UserProfileResponse,
  UsersApiResponse,
} from "@/types/user-response.types"

export const useUsersQuery = ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery<UsersApiResponse>({
    queryKey: ["users", page, limit, search],
    queryFn: async () => {
      const res = await apiClient.get<UsersApiResponse>("/admin/users", {
        params: { page, limit, search },
      })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 3,
  })
}

export const useProfileQuery = () => {
  return useQuery<UserProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiClient.get<UserProfileResponse>("/auth/profile")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
