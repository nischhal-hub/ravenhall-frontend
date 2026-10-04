export type PosPaymentMethod = 'CASH' | 'CARD' | 'STRIPE' | 'BANK_TRANSFER' | 'OTHER'
export type PosBookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type PosPaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'

export interface PosCustomer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  membership: {
    plan: string
    discountPct: number
    isActive: boolean
    endDate: string
  } | null
  _count: {
    bookings: number
  }
}

export interface PosCustomerDetail extends PosCustomer {
  role: string
  membership: {
    plan: string
    discountPct: number
    isActive: boolean
    startDate: string
    endDate: string
  } | null
  bookings: Array<{
    id: string
    bookingRef: string
    status: PosBookingStatus
    totalAmount: number
    discountAmount: number
    finalAmount: number
    createdAt: string
    items: Array<{
      slot: {
        lane: {
          name: string
          type: string
        }
      }
    }>
    payment?: {
      paymentMethod: PosPaymentMethod
      status: PosPaymentStatus
      amount: number
    } | null
  }>
  createdAt: string
}

export interface PosSlotBookingInfo {
  bookingRef: string
  status: PosBookingStatus
  customerName: string
  customerPhone?: string | null
}

export interface PosSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  isBlocked: boolean
  currentBooking: PosSlotBookingInfo | null
}

export interface PosLaneWithSlots {
  id: string
  name: string
  type: 'BATTING' | 'BOWLING' | 'GENERAL'
  hourlyRate: number
  capacity: number
  description: string | null
  imageUrl: string | null
  stats: {
    totalSlots: number
    availableSlots: number
    bookedSlots: number
    blockedSlots: number
  }
  slots: PosSlot[]
}

export interface PosPriceItem {
  slotId: string
  laneId: string
  laneName: string
  laneType: string
  date: string
  startTime: string
  endTime: string
  unitPrice: number
  subtotal: number
}

export interface PosPriceCalculation {
  items: PosPriceItem[]
  totalAmount: number
  discountBreakdown: {
    membership: {
      plan: string | null
      discountPct: number
    }
    discountCode: {
      code: string
      discountPct: number
    } | null
    customDiscount: {
      pct: number
      amount: number
    }
    appliedPct: number
    pctDiscountAmount: number
    flatDiscountAmount: number
    totalDiscountAmount: number
  }
  finalAmount: number
  discountCodeRecord: {
    id: string
    code: string
    discountPct: number
  } | null
}

export interface PosBookingListItem {
  id: string
  bookingRef: string
  userId: string
  status: PosBookingStatus
  totalAmount: number
  discountAmount: number
  finalAmount: number
  notes: string | null
  source: 'POS' | 'ONLINE'
  bookedById: string | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
  }
  bookedBy?: {
    id: string
    firstName: string
    lastName: string
  } | null
  items: Array<{
    slot: {
      lane: {
        id: string
        name: string
        type: string
      }
    }
  }>
  payment: {
    id: string
    paymentMethod: PosPaymentMethod
    status: PosPaymentStatus
    amount: number
    paidAt: string | null
  } | null
}

export interface PosBookingDetail extends PosBookingListItem {
  updatedAt: string
  discountCodeId?: string | null
  discountCode?: {
    id: string
    code: string
    discountPct: number
  } | null
  items: Array<{
    id: string
    bookingId: string
    slotId: string
    unitPrice: number
    subtotal: number
    slot: {
      id: string
      laneId: string
      date: string
      startTime: string
      endTime: string
      lane: {
        id: string
        name: string
        type: string
        hourlyRate: number
      }
    }
  }>
}

export interface PosReceipt {
  receiptNumber: string
  bookingId: string
  issuedAt: string
  cashier: string
  customer: {
    id: string
    name: string
    email: string | null
    phone: string | null
    isGuest: boolean
  }
  items: Array<{
    laneName: string
    laneType: string
    date: string
    time: string
    rate: number
    amount: number
  }>
  pricing: {
    subtotal: number
    discount: number
    discountCode: string | null
    total: number
    currency: string
  }
  payment: {
    method: PosPaymentMethod
    status: PosPaymentStatus
    paidAt: string | null
    amountPaid: number
  } | null
  bookingStatus: PosBookingStatus
  notes: string | null
  venue: {
    name: string
    address: string
    phone: string
    email: string
  }
}

// ── Standard API Response Wrappers ──────────────────────────────────────────

export interface PosApiResponse<T> {
  status: string
  message?: string
  data: T
}

export interface PosBookingsApiResponse {
  status: string
  message?: string
  data: {
    bookings: PosBookingListItem[]
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}
