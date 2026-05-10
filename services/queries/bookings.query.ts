// services/queries/booking.query.ts
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../api/client"
import {
  BookingApiResponse,
  BookingByIdResponse,
} from "@/types/booking-response.types"

export const useBookingsQuery = (page = 1, limit = 20) => {
  return useQuery<BookingApiResponse>({
    queryKey: ["bookings", page, limit],
    queryFn: async () => {
      const res = await apiClient.get<BookingApiResponse>("/bookings", {
        params: { page, limit },
      })
      return res.data
    },
    retry: 2,
    staleTime: 1000 * 60 * 3, // 3 minutes
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
