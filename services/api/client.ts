import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { ApiError, type ApiErrorResponse } from "@/types/response"
import { clearAuthTokens, getAccessToken } from "@/services/auth/token-store"
import {
  SessionExpiredError,
  browserNavigation,
  expireSession,
  loginPathFor,
  refreshSession,
} from "@/services/auth/refresh"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api"

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

declare module "axios" {
  interface AxiosRequestConfig {
    /** Set once a request has been retried after a token refresh */
    _authRetried?: boolean
  }
}

/**
 * Endpoints whose 401 means "wrong credentials / bad code", never "token
 * expired", so they must not trigger a refresh. Logout is included so signing
 * out never turns into a "session expired" redirect.
 */
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
]

const isNoRefreshPath = (url = "") => {
  const path = url.split("?")[0]
  return NO_REFRESH_PATHS.some((p) => path.endsWith(p) || path.includes(`${p}/`))
}

const sentToken = (config: InternalAxiosRequestConfig) => {
  const header = config.headers.get("Authorization")
  return typeof header === "string" && header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : null
}

let isHandlingUnauthorized = false

/** A 401 on a request that had no session to refresh: go and sign in */
function handleUnauthorized() {
  if (typeof window === "undefined") {
    return
  }

  clearAuthTokens()

  const pathname = window.location.pathname
  const loginPath = loginPathFor(pathname)

  if (!pathname.startsWith(loginPath)) {
    if (isHandlingUnauthorized) {
      return
    }

    isHandlingUnauthorized = true
    browserNavigation.replace(loginPath)
  }
}

const toApiError = (error: AxiosError<ApiErrorResponse>) =>
  new ApiError(
    error.response?.data?.message ?? error.message ?? "Request failed",
    error.response?.status,
    error.response?.data
  )

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const config = error.config

    if (status !== 401 || !config || isNoRefreshPath(config.url)) {
      return Promise.reject(toApiError(error))
    }

    const staleToken = sentToken(config)
    if (!staleToken) {
      handleUnauthorized()
      return Promise.reject(toApiError(error))
    }

    // Already refreshed once and still rejected: the session is gone
    if (config._authRetried) {
      void expireSession()
      return Promise.reject(new SessionExpiredError())
    }

    try {
      const accessToken = await refreshSession(staleToken)
      config._authRetried = true
      config.headers.set("Authorization", `Bearer ${accessToken}`)
      return apiClient(config)
    } catch (refreshError) {
      if (refreshError instanceof SessionExpiredError) {
        void expireSession()
      }
      // A network failure while refreshing keeps the session; surface it
      return Promise.reject(refreshError)
    }
  }
)
