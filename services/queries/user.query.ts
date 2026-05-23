import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { UsersApiResponse } from "@/types/user-response.types"

// Import from mutations (recommended for consistency)
import type { ProfileResponse } from "../mutations/user.mutations"

// =============================================
// ADMIN - Get All Users
// =============================================
export const useUsersQuery = ({
  page = 1,
  limit = 20,
  search = "",
}: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ["users", { page, limit, search }],
    queryFn: async (): Promise<UsersApiResponse> => {
      const res = await apiClient.get<UsersApiResponse>("/admin/users", {
        params: { page, limit, search },
      })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 3,
  })
}

// =============================================
// CURRENT USER PROFILE (Recommended for Settings)
// =============================================
export const useProfilesQuery = () => {
  return useQuery<ProfileResponse>({
    queryKey: ["profiles"],
    queryFn: async (): Promise<ProfileResponse> => {
      const res = await apiClient.get<ProfileResponse>("/auth/me")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

// =============================================
// Alternative Profile Query (if needed)
// =============================================
export const useProfileQuery = () => {
  return useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileResponse> => {
      const res = await apiClient.get<ProfileResponse>("/auth/profile")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
