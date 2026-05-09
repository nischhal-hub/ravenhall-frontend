import { useMutation } from "@tanstack/react-query"

import {
  forgotPasswordRequest,
  logoutRequest,
  loginRequest,
  refreshAccessTokenRequest,
  registerRequest,
  resetPasswordRequest,
  verifyEmailRequest,
  type AuthApiResponse,
  type LoginResponse,
  type RefreshTokenResponse,
  type RegisterResponse,
} from "@/services/api/auth"
import {
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
} from "@/schemas/auth"
import { ApiError } from "@/types/response"

export function useRegisterMutation() {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationKey: ["auth", "register"],
    mutationFn: registerRequest,
  })
}

export function useLoginMutation() {
  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationKey: ["auth", "login"],
    mutationFn: loginRequest,
  })
}

export function useForgotPasswordMutation() {
  return useMutation<AuthApiResponse, ApiError, ForgotPasswordPayload>({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: forgotPasswordRequest,
  })
}

export function useResetPasswordMutation() {
  return useMutation<AuthApiResponse, ApiError, ResetPasswordPayload>({
    mutationKey: ["auth", "reset-password"],
    mutationFn: resetPasswordRequest,
  })
}

export function useLogoutMutation() {
  return useMutation<
    AuthApiResponse,
    ApiError,
    { refreshToken?: string } | void
  >({
    mutationKey: ["auth", "logout"],
    mutationFn: (payload) => logoutRequest(payload ?? undefined),
  })
}

export function useRefreshTokenMutation() {
  return useMutation<RefreshTokenResponse, ApiError, { token: string }>({
    mutationKey: ["auth", "refresh"],
    mutationFn: refreshAccessTokenRequest,
  })
}

export function useVerifyEmailMutation() {
  return useMutation<AuthApiResponse, ApiError, string>({
    mutationKey: ["auth", "verify-email"],
    mutationFn: verifyEmailRequest,
  })
}
