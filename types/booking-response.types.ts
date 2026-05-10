import { Lane } from "./lane-response.types"

export interface Booking {
  id: string
  bookingRef: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  totalAmount: number
  discountAmount: number
  finalAmount: number
  notes?: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  items: Array<{
    slot: {
      date: string
      startTime: string
      endTime: string
      lane: {
        name: string
      }
    }
  }>
  payment?: {
    status: string
    amount: number
  }
}

export interface BookingApiResponse {
  status: string
  data: {
    bookings: Booking[]
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface BookingByIdResponse {
  status: string
  message: string
  data: BookingDetail
}

export interface BookingDetail {
  id: string
  bookingRef: string
  userId: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  totalAmount: number
  discountAmount: number
  finalAmount: number
  notes: string | null
  discountCodeId: string | null
  createdAt: string
  updatedAt: string

  // Nested Relations
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    role: string
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
  }

  items: BookingItem[]

  payment: {
    id: string
    bookingId: string
    stripePaymentIntentId: string
    amount: number
    currency: string
    status: string
    refundAmount: number | null
    stripeRefundId: string | null
    paidAt: string
    createdAt: string
    updatedAt: string
  } | null

  discountCode: any | null
}

export interface BookingItem {
  id: string
  bookingId: string
  slotId: string
  unitPrice: number
  subtotal: number
  createdAt: string

  slot: {
    id: string
    laneId: string
    date: string
    startTime: string
    endTime: string
    isAvailable: boolean
    isBlocked: boolean
    createdAt: string

    lane: Lane
  }
}
