import axios, { AxiosError } from "axios"
import { ApiError, type ApiErrorResponse } from "@/types/response"
import { clearAuthTokens, getAccessToken } from "@/services/auth/token-store"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api"

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

let isHandlingUnauthorized = false

function handleUnauthorized() {
  if (typeof window === "undefined") {
    return
  }

  clearAuthTokens()

  const pathname = window.location.pathname
  const isAdminArea = pathname.startsWith("/admin")
  const loginPath = isAdminArea ? "/admin/auth" : "/auth"

  if (!pathname.startsWith(loginPath)) {
    if (isHandlingUnauthorized) {
      return
    }

    isHandlingUnauthorized = true
    window.location.replace(loginPath)
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status

    if (status === 401) {
      handleUnauthorized()
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Request failed"

    return Promise.reject(new ApiError(message, status, error.response?.data))
  }
)
