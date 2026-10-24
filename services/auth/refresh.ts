import axios, { isAxiosError } from "axios"

import { ApiError } from "@/types/response"
import {
  ACCESS_TOKEN_KEY,
  clearAuthTokens,
  getAccessToken,
  getAuthRole,
  getRefreshToken,
  setAuthTokens,
} from "@/services/auth/token-store"

/**
 * Keeps the session alive. The access token lives ~15 minutes; the refresh
 * token is an HttpOnly cookie the API reads on POST /auth/refresh (it does not
 * rotate it). Every caller goes through `refreshSession`, which makes at most
 * one refresh call at a time per tab, and per browser where Web Locks exist.
 */

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api"

/** Plain client: no interceptors, so a failing refresh can never recurse */
export const refreshClient = axios.create({
  baseURL,
  timeout: 15_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

export const SESSION_EXPIRED_MESSAGE =
  "Your session expired, please sign in again."
export const SESSION_EXPIRED_REASON = "session-expired"

/** The refresh token was rejected (expired, revoked, missing): sign in again */
export class SessionExpiredError extends ApiError {
  constructor() {
    super(SESSION_EXPIRED_MESSAGE, 401)
    this.name = "SessionExpiredError"
  }
}

type RefreshResponse = {
  data?: { accessToken?: string; refreshToken?: string }
}

/** Refresh this long before the access token expires... */
const REFRESH_AHEAD_MS = 60_000
/** ...but never in the last quarter-lifetime of a short token, and never sooner than this */
const MIN_REFRESH_DELAY_MS = 5_000
/** Retry delay for a proactive refresh that hit a network error */
const RETRY_AFTER_NETWORK_ERROR_MS = 30_000
const LOCK_NAME = "ravenhall-auth-refresh"

function decodePayload(
  token: string
): { exp?: number; iat?: number; userId?: string } | null {
  try {
    const part = token.split(".")[1]
    if (!part) return null
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")))
  } catch {
    return null
  }
}

/** Milliseconds since epoch at which the token expires, or null if unknown */
export function tokenExpiresAt(token: string | null | undefined) {
  const exp = token ? decodePayload(token)?.exp : undefined
  return typeof exp === "number" ? exp * 1000 : null
}

/**
 * How long to wait before refreshing `token`: a minute before expiry, or for
 * short-lived tokens (lifetime from `iat`) three quarters of the way through,
 * so a 30-second token isn't refreshed again the instant it arrives.
 */
export function proactiveRefreshDelay(token: string, now = Date.now()) {
  const payload = decodePayload(token)
  if (typeof payload?.exp !== "number") return null
  const expiresAt = payload.exp * 1000
  const lifetime =
    typeof payload.iat === "number" ? expiresAt - payload.iat * 1000 : Infinity
  const ahead = Math.min(REFRESH_AHEAD_MS, lifetime / 4)
  return Math.max(MIN_REFRESH_DELAY_MS, expiresAt - now - ahead)
}

const isUsable = (token: string | null): token is string => {
  if (!token) return false
  const expiresAt = tokenExpiresAt(token)
  return expiresAt === null || expiresAt > Date.now()
}

const tokenUser = (token: string | null) =>
  token ? (decodePayload(token)?.userId ?? null) : null

let inflight: Promise<string> | null = null

async function requestNewToken(): Promise<string> {
  try {
    // The API reads the HttpOnly cookie; the stored token is sent as well, as
    // the old refresh mutation did, and is ignored by the current API.
    const refreshToken = getRefreshToken()
    const response = await refreshClient.post<RefreshResponse>(
      "/auth/refresh",
      refreshToken ? { token: refreshToken } : {}
    )
    const accessToken = response.data?.data?.accessToken
    if (!accessToken) throw new SessionExpiredError()

    // Store a rotated refresh token too, should the API ever start sending one
    setAuthTokens(
      { accessToken, refreshToken: response.data?.data?.refreshToken },
      getAuthRole() ?? undefined
    )
    scheduleProactiveRefresh()
    return accessToken
  } catch (error) {
    if (error instanceof SessionExpiredError) throw error
    const status = isAxiosError(error) ? error.response?.status : undefined
    if (status === 400 || status === 401 || status === 403) {
      throw new SessionExpiredError()
    }
    // Offline, timeout, 5xx, 429: keep the session and let the caller show it
    throw new ApiError(
      "We couldn't reach the server to refresh your session. Check your connection and try again.",
      status
    )
  }
}

async function refreshOnce(staleToken: string | null): Promise<string> {
  // Another tab may have refreshed while we waited for the lock
  const current = getAccessToken()
  if (current && current !== staleToken && isUsable(current)) return current
  return requestNewToken()
}

/**
 * Returns a fresh access token. `staleToken` is the token the caller just saw
 * rejected; if a newer usable one is already stored (another request or tab
 * refreshed first), it is returned without calling the API.
 */
export function refreshSession(
  staleToken: string | null = getAccessToken()
): Promise<string> {
  const current = getAccessToken()
  if (current && current !== staleToken && isUsable(current)) {
    return Promise.resolve(current)
  }

  if (!inflight) {
    const locks = typeof navigator !== "undefined" ? navigator.locks : undefined
    const run = async (): Promise<string> =>
      locks
        ? await locks.request(LOCK_NAME, () => refreshOnce(staleToken))
        : refreshOnce(staleToken)
    inflight = run().finally(() => {
      inflight = null
    })
  }
  return inflight
}

// ── Proactive refresh ─────────────────────────────────────────────────────

let timer: ReturnType<typeof setTimeout> | null = null

export function cancelProactiveRefresh() {
  if (timer) clearTimeout(timer)
  timer = null
}

/** Refreshes shortly before the stored access token expires */
export function scheduleProactiveRefresh(delayOverride?: number) {
  cancelProactiveRefresh()
  if (typeof window === "undefined") return

  const token = getAccessToken()
  const delay = delayOverride ?? (token ? proactiveRefreshDelay(token) : null)
  if (!token || delay === null) return

  timer = setTimeout(() => {
    timer = null
    refreshSession(token).catch((error) => {
      if (error instanceof SessionExpiredError) {
        void expireSession()
      } else {
        scheduleProactiveRefresh(RETRY_AFTER_NETWORK_ERROR_MS)
      }
    })
  }, delay)
}

// ── Session expiry ────────────────────────────────────────────────────────

let onSessionExpired: (() => Promise<void> | void) | null = null
let expiring = false

/**
 * Registered by the app's QueryProvider so an expired session goes through the
 * normal logout path (tokens + every cached query cleared).
 */
export function setSessionExpiredHandler(handler: typeof onSessionExpired) {
  onSessionExpired = handler
}

/** Page navigation, in one place so tests can observe it */
export const browserNavigation = {
  replace: (url: string) => window.location.replace(url),
  reload: () => window.location.reload(),
}

export function loginPathFor(pathname: string) {
  return pathname.startsWith("/admin") ? "/admin/auth" : "/auth"
}

/** Ends the session and sends the user to sign in with a friendly message */
export async function expireSession() {
  if (expiring || typeof window === "undefined") return
  expiring = true
  cancelProactiveRefresh()
  try {
    if (onSessionExpired) await onSessionExpired()
    else clearAuthTokens()
  } catch {
    clearAuthTokens()
  }
  const loginPath = loginPathFor(window.location.pathname)
  browserNavigation.replace(`${loginPath}?reason=${SESSION_EXPIRED_REASON}`)
}

// ── Other tabs ────────────────────────────────────────────────────────────

/**
 * Tokens live in localStorage, which all tabs share. When another tab
 * refreshes, this tab just re-arms its timer (the refresh token isn't rotated,
 * so nothing here is invalidated). When another tab signs out or signs in as
 * someone else, this tab reloads so it can't keep showing the old account's
 * cached data. Returns the cleanup function.
 */
export function startSessionSync() {
  if (typeof window === "undefined") return () => undefined

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== ACCESS_TOKEN_KEY) return
    if (!event.oldValue) {
      // This tab had no session; nothing of ours to protect
      if (event.newValue) scheduleProactiveRefresh()
      return
    }
    if (!event.newValue || tokenUser(event.newValue) !== tokenUser(event.oldValue)) {
      cancelProactiveRefresh()
      browserNavigation.reload()
      return
    }
    scheduleProactiveRefresh()
  }

  window.addEventListener("storage", onStorage)
  scheduleProactiveRefresh()
  return () => {
    window.removeEventListener("storage", onStorage)
    cancelProactiveRefresh()
  }
}
