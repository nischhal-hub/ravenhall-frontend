const ACCESS_TOKEN_KEY = "ravenhall_access_token"
const REFRESH_TOKEN_KEY = "ravenhall_refresh_token"
const AUTH_ROLE_KEY = "ravenhall_role"

export type AuthTokens = {
  accessToken: string
  refreshToken?: string
}

type CookieOptions = {
  maxAgeDays?: number
}

function getStorage() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null
  }

  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=")
    if (key === name) {
      return decodeURIComponent(rest.join("="))
    }
  }

  return null
}

function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === "undefined") {
    return
  }

  const maxAgeDays = options.maxAgeDays ?? 7
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:"
  const secure = isSecure ? "; Secure" : ""

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`
}

function clearCookie(name: string) {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function getAccessToken() {
  const storage = getStorage()
  const token = storage?.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    return token
  }

  return getCookie(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  const storage = getStorage()
  const token = storage?.getItem(REFRESH_TOKEN_KEY)
  if (token) {
    return token
  }

  return getCookie(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(tokens: AuthTokens, role?: string) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)

    if (tokens.refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    }
  }

  setCookie(ACCESS_TOKEN_KEY, tokens.accessToken)

  if (role) {
    setCookie(AUTH_ROLE_KEY, role.toLowerCase())
  }
}

export function clearAuthTokens() {
  const storage = getStorage()
  if (storage) {
    storage.removeItem(ACCESS_TOKEN_KEY)
    storage.removeItem(REFRESH_TOKEN_KEY)
  }

  clearCookie(ACCESS_TOKEN_KEY)
  clearCookie(REFRESH_TOKEN_KEY)
  clearCookie(AUTH_ROLE_KEY)
}

export function getAuthRole() {
  return getCookie(AUTH_ROLE_KEY)
}
