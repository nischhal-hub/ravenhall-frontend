import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { MembershipPlansApiResponse } from "@/types/membership-response.types"

// ==================== MEMBERSHIP PLANS QUERY ====================
export const useMembershipPlansQuery = () => {
  return useQuery<MembershipPlansApiResponse>({
    queryKey: ["membership-plans"],
    queryFn: async () => {
      const res =
        await apiClient.get<MembershipPlansApiResponse>("/memberships")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// ==================== MY MEMBERSHIP QUERY ====================

// Define response type
export interface MyMembershipResponse {
  id: string
  userId: string
  plan: string
  discountPct: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  payment?: {
    id: string
    amount: number
    status: string
    paidAt?: string
  }
}

// Fetch user's current membership
export const useMyMembershipQuery = () => {
  return useQuery<MyMembershipResponse>({
    queryKey: ["my-membership"],
    queryFn: async () => {
      const res = await apiClient.get<MyMembershipResponse>("/memberships/me")
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  })
}

// Discount % the logged-in customer gets on lane hire (0 if no active plan).
export const useMemberDiscount = () => {
  const { data, isLoading } = useMyMembershipQuery()
  // The API wraps the membership in `data`, which the query type doesn't model
  const membership = (data as unknown as { data?: MyMembershipResponse })?.data
  const active =
    !!membership?.isActive && new Date(membership.endDate) > new Date()

  return {
    discountPct: active ? membership.discountPct : 0,
    plan: active ? membership.plan : null,
    isLoading,
  }
}
