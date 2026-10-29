"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiError } from "@/types/response"
import type { Booking } from "@/types/booking-response.types"
import type { AppNotification } from "@/types/notification-response.types"
import type {
  AccountStatus,
  UpdateUserStatusResult,
} from "@/types/user-response.types"
import { toast } from "sonner"
import { apiClient } from "../api/client"

// ==================== CORE TYPES ====================
export interface ProfileData {
  id: string
  createdAt?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  imageUrl?: string
  isEmailVerified?: boolean
  // GET /auth/profile: bookings without the user, IN_APP notifications
  bookings?: Omit<Booking, "user">[]
  notifications?: AppNotification[]
  membership?: {
    plan: string
    isActive: boolean
    endDate?: string
  }
}

export interface ProfileResponse {
  status: string
  message: string
  data: ProfileData
}

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

// ==================== API REQUESTS ====================
const updateProfileRequest = async (
  payload: UpdateProfilePayload
): Promise<ProfileResponse> => {
  if (payload.image) {
    const formData = new FormData()
    if (payload.firstName) formData.append("firstName", payload.firstName)
    if (payload.lastName) formData.append("lastName", payload.lastName)
    if (payload.phone) formData.append("phone", payload.phone)
    formData.append("image", payload.image)

    const { data } = await apiClient.patch("/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  } else {
    const { data } = await apiClient.patch("/user/profile", {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    })
    return data
  }
}

// ==================== MUTATIONS ====================
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation<ProfileResponse, ApiError, UpdateProfilePayload>({
    mutationKey: ["update-profile"],
    mutationFn: updateProfileRequest,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })

      queryClient.setQueryData(["profiles"], response)
      queryClient.setQueryData(["profile"], response)

      toast.success("Profile updated successfully!")
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update profile")
    },
  })
}

// ADMIN - deactivate / reactivate an account
export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    UpdateUserStatusResult,
    ApiError,
    { id: string; status: AccountStatus; reason?: string }
  >({
    mutationKey: ["users", "status"],
    mutationFn: async ({ id, ...body }) => {
      const { data } = await apiClient.patch<{ data: UpdateUserStatusResult }>(
        `/admin/users/${id}/status`,
        body
      )
      return data.data
    },
    onSuccess: (result) => {
      // Refetch from the server so the list shows the stored status, not a guess
      queryClient.invalidateQueries({ queryKey: ["users"] })
      if (result.cancelledBookings.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["bookings"] })
      }

      if (result.user.status === "INACTIVE") {
        const cancelled = result.cancelledBookings.length
        toast.success(
          cancelled > 0
            ? `Account deactivated. ${cancelled} upcoming booking${cancelled === 1 ? "" : "s"} cancelled.`
            : "Account deactivated"
        )
      } else {
        toast.success("Account reactivated")
      }

      if (result.failedBookings.length > 0) {
        toast.error(
          `Couldn't cancel ${result.failedBookings
            .map((b) => b.bookingRef)
            .join(", ")}. Please cancel ${result.failedBookings.length === 1 ? "it" : "them"} manually.`
        )
      }
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to update account status")
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation<
    { status: string; message: string },
    ApiError,
    ChangePasswordPayload
  >({
    mutationKey: ["change-password"],
    mutationFn: async (data) => {
      const { data: response } = await apiClient.post(
        "/user/change-password",
        data
      )
      return response
    },
    onSuccess: () => {
      toast.success("Password changed successfully!")
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Failed to change password")
    },
  })
}
