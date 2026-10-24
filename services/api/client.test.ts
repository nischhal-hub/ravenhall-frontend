// Automatic token refresh: retry once on 401, single-flight refresh, session
// expiry vs network errors, no refresh loops, proactive refresh, other tabs.
// HTTP is faked with axios adapters; timers are fake, nothing waits.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios"

type Modules = {
  client: typeof import("@/services/api/client")
  refresh: typeof import("@/services/auth/refresh")
  store: typeof import("@/services/auth/token-store")
  session: typeof import("@/services/auth/session")
  auth: typeof import("@/services/api/auth")
  AxiosError: typeof import("axios").AxiosError
}
let m: Modules

const NOW = new Date("2026-10-24T09:00:00.000Z")

/** Unsigned JWT-shaped token; only the payload is read client-side */
function jwt(userId: string, expiresInSec: number, tag = "", issuedAt?: Date) {
  const b64 = (o: object) =>
    btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")
  const iat = Math.floor((issuedAt ?? NOW).getTime() / 1000)
  const exp = iat + expiresInSec
  return `${b64({ alg: "HS256" })}.${b64({ userId, iat, exp, tag })}.sig`
}

const EXPIRED = jwt("user-a", -10, "old")
const FRESH = jwt("user-a", 15 * 60, "new")

const apiCalls: { url?: string; auth?: string }[] = []
let refreshCalls = 0
let refreshBehaviour: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>
const replace = vi.fn()
const reload = vi.fn()

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown) {
  const response = { data, status, statusText: "", headers: {}, config } as AxiosResponse
  if (status >= 400) {
    return Promise.reject(
      new m.AxiosError(`Request failed with status code ${status}`, "ERR_BAD_REQUEST", config, null, response)
    )
  }
  return Promise.resolve(response)
}

/** Protected API: accepts only FRESH; auth endpoints answer 401 for bad input */
const apiAdapter: AxiosAdapter = (config) => {
  const auth = config.headers.get("Authorization") as string | undefined
  apiCalls.push({ url: config.url, auth })
  if (config.url?.startsWith("/auth/")) {
    return respond(config, 401, { message: "Invalid email or password" })
  }
  if (auth !== `Bearer ${FRESH}`) return respond(config, 401, { message: "Invalid or expired token" })
  return respond(config, 200, { data: { ok: true, url: config.url } })
}

const refreshAdapter: AxiosAdapter = (config) => {
  refreshCalls++
  return refreshBehaviour(config)
}
const refreshSucceeds = (token = FRESH) => (config: InternalAxiosRequestConfig) =>
  respond(config, 200, { status: "success", data: { accessToken: token } })

beforeEach(async () => {
  vi.useFakeTimers({ now: NOW, toFake: ["setTimeout", "clearTimeout", "Date"] })
  vi.resetModules()
  localStorage.clear()
  document.cookie.split(";").forEach((c) => {
    document.cookie = `${c.split("=")[0].trim()}=; Max-Age=0; Path=/`
  })
  apiCalls.length = 0
  refreshCalls = 0
  refreshBehaviour = refreshSucceeds()
  replace.mockReset()
  reload.mockReset()

  m = {
    client: await import("@/services/api/client"),
    refresh: await import("@/services/auth/refresh"),
    store: await import("@/services/auth/token-store"),
    session: await import("@/services/auth/session"),
    auth: await import("@/services/api/auth"),
    AxiosError: (await import("axios")).AxiosError,
  }
  m.client.apiClient.defaults.adapter = apiAdapter
  m.refresh.refreshClient.defaults.adapter = refreshAdapter
  m.refresh.browserNavigation.replace = replace
  m.refresh.browserNavigation.reload = reload
  m.store.setAuthTokens({ accessToken: EXPIRED, refreshToken: "refresh-a" }, "customer")
})

afterEach(() => {
  m.refresh.cancelProactiveRefresh()
  vi.useRealTimers()
})

describe("401 on a protected request", () => {
  it("refreshes once, stores the new token and retries the request once", async () => {
    const res = await m.client.apiClient.get("/bookings/my")

    expect(res.data.data.ok).toBe(true)
    expect(refreshCalls).toBe(1)
    expect(apiCalls.map((c) => c.auth)).toEqual([`Bearer ${EXPIRED}`, `Bearer ${FRESH}`])
    expect(m.store.getAccessToken()).toBe(FRESH)
    expect(m.store.getAuthRole()).toBe("customer") // role cookie kept
  })

  it("five parallel 401s share ONE refresh call and all five are retried", async () => {
    let release!: () => void
    const gate = new Promise<void>((resolve) => (release = resolve))
    refreshBehaviour = async (config) => {
      await gate
      return refreshSucceeds()(config)
    }

    const urls = ["/a", "/b", "/c", "/d", "/e"]
    const pending = Promise.all(urls.map((u) => m.client.apiClient.get(u)))
    await vi.waitFor(() => expect(apiCalls).toHaveLength(5))
    release()
    const results = await pending

    expect(refreshCalls).toBe(1)
    expect(results.map((r) => r.data.data.url)).toEqual(urls)
    expect(apiCalls.filter((c) => c.auth === `Bearer ${FRESH}`)).toHaveLength(5)
  })

  it("a request that fails after another one already refreshed just retries", async () => {
    await m.client.apiClient.get("/first")
    // A request that was sent with the old token and answered late
    const late = await m.refresh.refreshSession(EXPIRED)
    expect(late).toBe(FRESH)
    expect(refreshCalls).toBe(1)
  })
})

describe("When the refresh itself fails", () => {
  it("auth failure: clears session and cache via logout path, redirects with a message", async () => {
    const onExpired = vi.fn(async () => undefined)
    m.refresh.setSessionExpiredHandler(async () => {
      await onExpired()
      m.store.clearAuthTokens()
    })
    refreshBehaviour = (config) => respond(config, 401, { message: "Invalid or expired refresh token" })

    await expect(m.client.apiClient.get("/bookings/my")).rejects.toMatchObject({
      name: "SessionExpiredError",
      message: m.refresh.SESSION_EXPIRED_MESSAGE,
    })
    await vi.waitFor(() => expect(replace).toHaveBeenCalledTimes(1))

    expect(onExpired).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith("/auth?reason=session-expired")
    expect(m.store.getAccessToken()).toBeNull()
  })

  it("clears the React Query cache through endSession", async () => {
    const { QueryClient } = await import("@tanstack/react-query")
    const queryClient = new QueryClient()
    queryClient.setQueryData(["bookings", "my"], [{ id: "b1" }])
    m.refresh.setSessionExpiredHandler(() => m.session.endSession(queryClient))
    refreshBehaviour = (config) => respond(config, 403, { message: "Forbidden" })

    await expect(m.client.apiClient.get("/bookings/my")).rejects.toThrow()
    await vi.waitFor(() => expect(replace).toHaveBeenCalled())

    expect(queryClient.getQueryData(["bookings", "my"])).toBeUndefined()
    expect(m.store.getAccessToken()).toBeNull()
  })

  it("network failure: keeps the session and surfaces the error", async () => {
    refreshBehaviour = (config) =>
      Promise.reject(new m.AxiosError("Network Error", "ERR_NETWORK", config))

    await expect(m.client.apiClient.get("/bookings/my")).rejects.toMatchObject({
      name: "ApiError",
      message: expect.stringMatching(/couldn't reach the server/),
    })
    expect(replace).not.toHaveBeenCalled()
    expect(m.store.getAccessToken()).toBe(EXPIRED)
  })

  it("a server error (5xx) during refresh does not log out either", async () => {
    refreshBehaviour = (config) => respond(config, 503, { message: "Unavailable" })
    await expect(m.client.apiClient.get("/bookings/my")).rejects.toThrow()
    expect(replace).not.toHaveBeenCalled()
  })

  it("a retried request that is rejected again ends the session (no loop)", async () => {
    refreshBehaviour = refreshSucceeds(jwt("user-a", 900, "still-rejected"))

    await expect(m.client.apiClient.get("/bookings/my")).rejects.toMatchObject({
      name: "SessionExpiredError",
    })
    await vi.waitFor(() => expect(replace).toHaveBeenCalledTimes(1))
    expect(refreshCalls).toBe(1)
    expect(apiCalls).toHaveLength(2)
  })
})

describe("Auth endpoints never trigger a refresh", () => {
  it.each([
    ["login", () => m.auth.loginRequest({ email: "a@example.com", password: "Wrong@123" })],
    ["refresh", () => m.auth.refreshAccessTokenRequest({ token: "x" })],
    ["verify-email", () => m.auth.verifyEmailRequest("123456")],
    ["logout", () => m.auth.logoutRequest()],
  ])("%s: 401 is returned as-is", async (_name, call) => {
    await expect(call()).rejects.toMatchObject({ name: "ApiError", status: 401 })
    expect(refreshCalls).toBe(0)
    expect(apiCalls).toHaveLength(1)
    expect(replace).not.toHaveBeenCalled()
  })

  it("a 401 with no session at all goes to sign in without refreshing", async () => {
    m.store.clearAuthTokens()
    await expect(m.client.apiClient.get("/bookings/my")).rejects.toMatchObject({ status: 401 })
    expect(refreshCalls).toBe(0)
    expect(replace).toHaveBeenCalledWith("/auth")
  })
})

describe("Proactive refresh", () => {
  it("refreshes a minute before expiry, so requests never see a 401", async () => {
    m.session.beginSession({ accessToken: jwt("user-a", 5 * 60, "five-min") }, "customer")

    await vi.advanceTimersByTimeAsync(3 * 60_000)
    expect(refreshCalls).toBe(0)
    await vi.advanceTimersByTimeAsync(60_000)
    expect(refreshCalls).toBe(1)
    expect(m.store.getAccessToken()).toBe(FRESH)

    await m.client.apiClient.get("/bookings/my")
    expect(apiCalls).toHaveLength(1)
  })

  it("short-lived tokens (e.g. 30s) refresh at 3/4 of their life, never in a tight loop", async () => {
    refreshBehaviour = (config) =>
      respond(config, 200, { data: { accessToken: jwt("user-a", 30, String(refreshCalls), new Date()) } })
    m.session.beginSession({ accessToken: jwt("user-a", 30) }, "customer")

    await vi.advanceTimersByTimeAsync(22_000)
    expect(refreshCalls).toBe(0)
    await vi.advanceTimersByTimeAsync(1_000) // 22.5s: first refresh
    expect(refreshCalls).toBe(1)
    await vi.advanceTimersByTimeAsync(1_000) // the new 30s token isn't refreshed straight away
    expect(refreshCalls).toBe(1)
    await vi.advanceTimersByTimeAsync(60_000 - 2_000) // ~one refresh per 22.5s over the next minute
    expect(refreshCalls).toBe(3)
  })

  it("logout cancels the timer", async () => {
    const { QueryClient } = await import("@tanstack/react-query")
    m.session.beginSession({ accessToken: jwt("user-a", 5 * 60) }, "customer")
    await m.session.endSession(new QueryClient())

    await vi.advanceTimersByTimeAsync(10 * 60_000)
    expect(refreshCalls).toBe(0)
  })

  it("a network error retries 30s later instead of logging out", async () => {
    let fail = true
    refreshBehaviour = (config) =>
      fail ? Promise.reject(new m.AxiosError("Network Error", "ERR_NETWORK", config)) : refreshSucceeds()(config)
    m.session.beginSession({ accessToken: jwt("user-a", 15 * 60) }, "customer")

    await vi.advanceTimersByTimeAsync(14 * 60_000)
    expect(refreshCalls).toBe(1)
    fail = false
    await vi.advanceTimersByTimeAsync(30_000)
    expect(refreshCalls).toBe(2)
    expect(replace).not.toHaveBeenCalled()
    expect(m.store.getAccessToken()).toBe(FRESH)
  })
})

describe("Other tabs", () => {
  const storageEvent = (oldValue: string | null, newValue: string | null) =>
    window.dispatchEvent(
      new StorageEvent("storage", { key: m.store.ACCESS_TOKEN_KEY, oldValue, newValue })
    )

  it("another tab's refresh (same user) re-arms the timer and does not log out", async () => {
    const stop = m.refresh.startSessionSync()
    storageEvent(EXPIRED, FRESH)
    expect(reload).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    stop()
  })

  it("another tab signing out or switching account reloads this tab", async () => {
    const stop = m.refresh.startSessionSync()
    storageEvent(FRESH, null)
    storageEvent(FRESH, jwt("user-b", 900))
    expect(reload).toHaveBeenCalledTimes(2)
    stop()
  })

  it("a tab without a session ignores another tab signing in", async () => {
    const stop = m.refresh.startSessionSync()
    storageEvent(null, FRESH)
    expect(reload).not.toHaveBeenCalled()
    stop()
  })
})
