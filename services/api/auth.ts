import {
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
} from "@/schemas/auth"
import { apiClient } from "@/services/api/client"

export type AuthUserRole = "ADMIN" | "CUSTOMER" | string

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  role: AuthUserRole
  isEmailVerified?: boolean
  createdAt?: string
  membership?: unknown
}

export type AuthApiResponse = {
  status?: string
  message?: string
  errors?: Record<string, string[]>
}

export type RegisterResponse = AuthApiResponse & {
  id: string
  email: string
  firstName: string
  lastName: string
  role: AuthUserRole
}

export type LoginResponse = AuthApiResponse & {
  data: {
    user: AuthUser
    accessToken: string
    refreshToken?: string
  }
}

export type RefreshTokenResponse = AuthApiResponse & {
  accessToken: string
}

export type GetMeResponse = AuthApiResponse & {
  data: AuthUser
}

export async function loginRequest(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload, {
    withCredentials: true,
  })
  return response.data
}

export async function registerRequest(payload: RegisterPayload) {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
    { withCredentials: true }
  )
  return response.data
}

export async function forgotPasswordRequest(payload: ForgotPasswordPayload) {
  const response = await apiClient.post<AuthApiResponse>(
    "/auth/forgot-password",
    payload
  )
  return response.data
}

export async function resetPasswordRequest(payload: ResetPasswordPayload) {
  const response = await apiClient.post<AuthApiResponse>(
    "/auth/reset-password",
    payload
  )
  return response.data
}

export async function logoutRequest(payload?: { refreshToken?: string }) {
  const response = await apiClient.post<AuthApiResponse>(
    "/auth/logout",
    payload,
    {
      withCredentials: true,
    }
  )
  return response.data
}

export async function refreshAccessTokenRequest(payload: { token: string }) {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/auth/refresh",
    payload,
    { withCredentials: true }
  )
  return response.data
}

export async function getMeRequest() {
  const response = await apiClient.get<GetMeResponse>("/auth/me", {
    withCredentials: true,
  })
  return response.data.data
}

export async function verifyEmailRequest(token: string) {
  const response = await apiClient.get<AuthApiResponse>(
    `/auth/verify-email/${token}`,
    { withCredentials: true }
  )
  return response.data
}
