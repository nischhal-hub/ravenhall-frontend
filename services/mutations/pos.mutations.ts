import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import { toast } from 'sonner'
import type {
  PosApiResponse,
  PosBookingDetail,
  PosCustomer,
  PosPriceCalculation,
} from '@/types/pos-response.types'
import type {
  CalculatePosPricePayload,
  CompletePosPaymentPayload,
  CreatePosBookingPayload,
  CreatePosCustomerFormData,
} from '@/schemas/pos'

// ================== REQUEST FUNCTIONS ==================

export async function createWalkInCustomerRequest(data: CreatePosCustomerFormData) {
  const response = await apiClient.post<PosApiResponse<PosCustomer>>('/pos/customers', data)
  return response.data.data
}

export async function calculatePosPriceRequest(data: CalculatePosPricePayload) {
  const response = await apiClient.post<PosApiResponse<PosPriceCalculation>>('/pos/calculate-price', data)
  return response.data.data
}

export async function createPosBookingRequest(data: CreatePosBookingPayload) {
  const response = await apiClient.post<PosApiResponse<PosBookingDetail>>('/pos/bookings', data)
  return response.data.data
}

export async function completePosPaymentRequest({
  bookingId,
  data,
}: {
  bookingId: string
  data: CompletePosPaymentPayload
}) {
  const response = await apiClient.post<PosApiResponse<PosBookingDetail>>(`/pos/bookings/${bookingId}/pay`, data)
  return response.data.data
}

// ================== MUTATION HOOKS ==================

/**
 * Quick-register a walk-in customer at the POS counter
 */
export function useCreateWalkInCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation<PosCustomer, Error, CreatePosCustomerFormData>({
    mutationKey: ['pos', 'customer', 'create'],
    mutationFn: createWalkInCustomerRequest,
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'customers'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(`Customer ${customer.firstName} ${customer.lastName} registered successfully`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to register customer'
      toast.error(message)
    },
  })
}

/**
 * Preview and calculate pricing for selected slots & applied discounts
 */
export function useCalculatePosPriceMutation() {
  return useMutation<PosPriceCalculation, Error, CalculatePosPricePayload>({
    mutationKey: ['pos', 'calculate-price'],
    mutationFn: calculatePosPriceRequest,
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to calculate price'
      toast.error(message)
    },
  })
}

/**
 * Submit POS booking (walk-in ground booking with cash, card, etc.)
 */
export function useCreatePosBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation<PosBookingDetail, Error, CreatePosBookingPayload>({
    mutationKey: ['pos', 'booking', 'create'],
    mutationFn: createPosBookingRequest,
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['pos', 'lanes-and-slots'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['slots'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Booking ${booking.bookingRef} processed successfully!`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to create POS booking'
      toast.error(message)
    },
  })
}

/**
 * Record payment for pending walk-in booking
 */
export function useCompletePosPaymentMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    PosBookingDetail,
    Error,
    { bookingId: string; data: CompletePosPaymentPayload }
  >({
    mutationKey: ['pos', 'booking', 'complete-payment'],
    mutationFn: completePosPaymentRequest,
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['pos', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['pos', 'booking', booking.id] })
      queryClient.invalidateQueries({ queryKey: ['pos', 'receipt', booking.id] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Payment recorded! Booking ${booking.bookingRef} is now confirmed.`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to complete payment'
      toast.error(message)
    },
  })
}
