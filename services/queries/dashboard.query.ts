import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import { DashboardData } from "@/types/dashboard-response"

export interface UserDashboardData {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }

  membership: {
    plan: string
    isActive: boolean
    endDate?: string
    discountPct: number
  } | null

  stats: {
    totalBookings: number
    totalSpent: number
    upcomingBookings: number
    cancelledBookings: number
  }

  upcomingBookings: UserBooking[]
  recentBookings: UserBooking[]
  totalRevenueThisMonth?: number // optional
}

export interface UserBooking {
  id: string
  bookingRef: string
  status: string
  finalAmount: number
  createdAt: string
  date: string // main booking date
  items: Array<{
    laneName: string
    type: string
    date: string
    startTime: string
    endTime: string
  }>
}

export const useDashboardQuery = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<{
        status: string
        message: string
        data: DashboardData
      }>("/admin/dashboard")

      return response.data.data
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
    refetchInterval: 1000 * 60 * 5, // Auto refresh every 5 minutes
    retry: 2,
  })
}

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn: async () => {
      const res = await apiClient.get("/user/dashboard")
      return res.data.data as UserDashboardData
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
