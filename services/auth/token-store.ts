const ACCESS_TOKEN_KEY = "ravenhall_access_token"
const REFRESH_TOKEN_KEY = "ravenhall_refresh_token"

export type AuthTokens = {
  accessToken: string
  refreshToken?: string
}

function getStorage() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

export function getAccessToken() {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  return storage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  return storage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(tokens: AuthTokens) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)

  if (tokens.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }
}

export function clearAuthTokens() {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.removeItem(ACCESS_TOKEN_KEY)
  storage.removeItem(REFRESH_TOKEN_KEY)
}
