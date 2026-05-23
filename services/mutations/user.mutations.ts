"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiError } from "@/types/response"
import { toast } from "sonner"
import { apiClient } from "../api/client"

// ==================== CORE TYPES ====================
export interface ProfileData {
  id: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  imageUrl?: string
  isEmailVerified?: boolean
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
