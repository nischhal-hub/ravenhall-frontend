import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import type {
  PosApiResponse,
  PosBookingDetail,
  PosBookingsApiResponse,
  PosCustomer,
  PosCustomerDetail,
  PosLaneWithSlots,
  PosPaymentMethod,
  PosReceipt,
} from '@/types/pos-response.types'

export interface PosBookingsFilterParams {
  page?: number
  limit?: number
  search?: string
  date?: string
  status?: string
  paymentMethod?: PosPaymentMethod | string
  bookedById?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

/**
 * Fetch lanes and their slots for a specific date in the POS terminal
 */
export function usePosLanesAndSlotsQuery({
  date,
  laneId,
  enabled = true,
}: {
  date: string
  laneId?: string
  enabled?: boolean
}) {
  return useQuery<PosLaneWithSlots[], Error>({
    queryKey: ['pos', 'lanes-and-slots', date, laneId],
    queryFn: async () => {
      const res = await apiClient.get<PosApiResponse<PosLaneWithSlots[]>>('/pos/lanes-and-slots', {
        params: {
          date,
          ...(laneId && { laneId }),
        },
      })
      return res.data.data
    },
    enabled: enabled && Boolean(date),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 45, // Auto-refresh slot grid every 45s for fresh counter availability
  })
}

/**
 * Search registered customers by name, phone, or email
 */
export function usePosCustomersQuery({
  search = '',
  limit = 10,
  enabled = true,
}: {
  search?: string
  limit?: number
  enabled?: boolean
}) {
  return useQuery<PosCustomer[], Error>({
    queryKey: ['pos', 'customers', search, limit],
    queryFn: async () => {
      const res = await apiClient.get<PosApiResponse<PosCustomer[]>>('/pos/customers', {
        params: { search, limit },
      })
      return res.data.data
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Fetch detailed customer info including recent bookings & membership
 */
export function usePosCustomerByIdQuery(id?: string) {
  return useQuery<PosCustomerDetail, Error>({
    queryKey: ['pos', 'customer', id],
    queryFn: async () => {
      const res = await apiClient.get<PosApiResponse<PosCustomerDetail>>(`/pos/customers/${id}`)
      return res.data.data
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  })
}

/**
 * List POS bookings with filters and pagination
 */
export function usePosBookingsQuery(filters: PosBookingsFilterParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    date,
    status,
    paymentMethod,
    bookedById,
    sortBy = 'createdAt',
    order = 'desc',
  } = filters

  return useQuery<PosBookingsApiResponse, Error>({
    queryKey: ['pos', 'bookings', page, limit, search, date, status, paymentMethod, bookedById, sortBy, order],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit,
        sortBy,
        order,
      }
      if (search) params.search = search
      if (date) params.date = date
      if (status && status !== 'ALL') params.status = status
      if (paymentMethod && paymentMethod !== 'ALL') params.paymentMethod = paymentMethod
      if (bookedById) params.bookedById = bookedById

      const res = await apiClient.get<PosBookingsApiResponse>('/pos/bookings', { params })
      return res.data
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

/**
 * Get single POS booking details
 */
export function usePosBookingByIdQuery(id?: string) {
  return useQuery<PosBookingDetail, Error>({
    queryKey: ['pos', 'booking', id],
    queryFn: async () => {
      const res = await apiClient.get<PosApiResponse<PosBookingDetail>>(`/pos/bookings/${id}`)
      return res.data.data
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  })
}

/**
 * Get formatted receipt for printable counter thermal receipt
 */
export function usePosReceiptQuery(bookingId?: string) {
  return useQuery<PosReceipt, Error>({
    queryKey: ['pos', 'receipt', bookingId],
    queryFn: async () => {
      const res = await apiClient.get<PosApiResponse<PosReceipt>>(`/pos/bookings/${bookingId}/receipt`)
      return res.data.data
    },
    enabled: Boolean(bookingId),
    staleTime: 1000 * 60 * 5,
  })
}
