import type { AppNotification } from "./notification-response.types"

// ==================== CORE USER TYPE ====================
// INACTIVE = deactivated by an admin (can't log in)
export type AccountStatus = "ACTIVE" | "INACTIVE"

export interface UpdateUserStatusResult {
  user: Pick<User, "id" | "email" | "firstName" | "lastName" | "role" | "status" | "deactivatedAt">
  cancelledBookings: string[]
  failedBookings: { bookingRef: string; message: string }[]
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: "CUSTOMER" | "STAFF" | "ADMIN"
  status: AccountStatus
  deactivatedAt?: string | null
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
  notifications?: AppNotification[]
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
