"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiError } from "@/types/response"
import { toast } from "sonner"
import { apiClient } from "../api/client"

// ==================== TYPES ====================
export interface ProfileData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  imageUrl?: string
  isEmailVerified: boolean
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
  image?: File | null
}

export interface ProfileResponse {
  status: string
  message: string
  data: ProfileData
}

// ==================== API REQUESTS ====================

const updateProfileRequest = async (
  payload: UpdateProfilePayload
): Promise<ProfileResponse> => {
  const formData = new FormData()

  if (payload.firstName) formData.append("firstName", payload.firstName)
  if (payload.lastName) formData.append("lastName", payload.lastName)
  if (payload.phone) formData.append("phone", payload.phone)
  if (payload.image) formData.append("image", payload.image)

  const response = await apiClient.patch("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// ==================== MUTATIONS ====================

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation<ProfileResponse, ApiError, UpdateProfilePayload>({
    mutationKey: ["user", "update-profile"],
    mutationFn: updateProfileRequest,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.setQueryData(["profile"], response.data)
      toast.success("Profile updated successfully!")
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update profile")
    },
  })
}

// Optional: Separate mutation for only password change
export function useChangePasswordMutation() {
  return useMutation<
    { status: string; message: string },
    ApiError,
    { oldPassword: string; newPassword: string }
  >({
    mutationKey: ["user", "change-password"],
    mutationFn: async (data) => {
      const response = await apiClient.post("/user/change-password", data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Password changed successfully!")
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to change password")
    },
  })
}
