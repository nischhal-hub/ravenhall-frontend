// services/queries/booking.query.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import {
  BookingApiResponse,
  BookingByIdResponse,
} from "@/types/booking-response.types"

export const useBookingsQuery = ({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "createdAt",
  order = "desc",
}: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  order?: "asc" | "desc"
}) => {
  return useQuery<BookingApiResponse>({
    queryKey: ["bookings", "all", page, limit, search, sortBy, order],
    queryFn: async () => {
      const res = await apiClient.get<BookingApiResponse>("/bookings", {
        params: {
          page,
          limit,
          search,
          sortBy,
          order,
        },
      })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 3,
  })
}
export const useOwnBookingsQuery = ({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "createdAt",
  order = "desc",
}: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  order?: "asc" | "desc"
}) => {
  return useQuery<BookingApiResponse>({
    // Must differ from the admin list key: both used to share one cache entry
    queryKey: ["bookings", "my", page, limit, search, sortBy, order],
    queryFn: async () => {
      const res = await apiClient.get<BookingApiResponse>("/bookings/my", {
        params: {
          page,
          limit,
          search,
          sortBy,
          order,
        },
      })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
}

export const useBookingById = (bookingId: string) => {
  return useQuery<BookingByIdResponse>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await apiClient.get<BookingByIdResponse>(
        `/bookings/${bookingId}`
      )
      return res.data
    },
    enabled: !!bookingId,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
}
