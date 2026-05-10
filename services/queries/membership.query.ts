import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { MembershipPlansApiResponse } from "@/types/membership-response.types"

export const useMembershipPlansQuery = () => {
  return useQuery<MembershipPlansApiResponse>({
    queryKey: ["membership-plans"],
    queryFn: async () => {
      const res =
        await apiClient.get<MembershipPlansApiResponse>("/memberships")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 10, // 10 minutes (less frequent changes)
  })
}
