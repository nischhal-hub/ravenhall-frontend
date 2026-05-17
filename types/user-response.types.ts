export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: "CUSTOMER" | "STAFF" | "ADMIN"
  isEmailVerified: boolean
  createdAt: string

  membership: {
    id: string
    plan: "CASUAL" | "MONTHLY" | "ANNUAL"
    discountPct: number
    startDate: string
    endDate: string
    isActive: boolean
  } | null

  _count: {
    bookings: number
  }
}

export interface UsersApiResponse {
  status: string
  message: string
  data: {
    users: User[]
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export interface UserProfileResponse {
  success: boolean
  message?: string
  data: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    role: "CUSTOMER" | "STAFF" | "ADMIN"
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string

    membership?: {
      plan: string
      discountPct: number
      startDate: string
      endDate: string
      isActive: boolean
    }

    bookings?: Array<{
      id: string
      bookingRef: string
      status: string
      totalAmount: number
      finalAmount: number
      createdAt: string
      // ... add more fields as needed
    }>

    notifications?: Array<any>
  }
}
