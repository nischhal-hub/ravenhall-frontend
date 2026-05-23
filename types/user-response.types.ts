// ==================== CORE USER TYPE ====================
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: "CUSTOMER" | "STAFF" | "ADMIN"
  isEmailVerified: boolean
  createdAt: string
  updatedAt?: string
  membership: Membership | null
  _count?: {
    bookings: number
  }
}

export interface Membership {
  id: string
  plan: "CASUAL" | "MONTHLY" | "ANNUAL"
  discountPct: number
  startDate: string
  endDate: string
  isActive: boolean
}

// ==================== API RESPONSES ====================

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

// Profile Response - Used in Settings, Dashboard, etc.
export interface UserProfileResponse {
  success: boolean
  message?: string
  data: UserProfileData
}

export interface UserProfileData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "CUSTOMER" | "STAFF" | "ADMIN"
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  membership?: Membership
  bookings?: Array<{
    id: string
    bookingRef: string
    status: string
    totalAmount: number
    finalAmount: number
    createdAt: string
  }>
  notifications?: any[] // You can define a proper type later
}

// ==================== PAYLOADS ====================
export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
  image?: File | null
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}
