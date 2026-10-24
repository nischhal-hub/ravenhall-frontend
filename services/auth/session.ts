import type { QueryClient } from "@tanstack/react-query"

import {
  cancelProactiveRefresh,
  scheduleProactiveRefresh,
} from "@/services/auth/refresh"
import {
  clearAuthTokens,
  setAuthTokens,
  type AuthTokens,
} from "@/services/auth/token-store"

/**
 * Drops every cached, user-specific query (bookings, notifications, profile,
 * dashboard, membership...). The QueryClient lives for the whole tab and login /
 * logout are client-side navigations, so without this the next account to sign
 * in would be served the previous account's cached data until it refetched.
 */
export async function resetUserState(queryClient: QueryClient) {
  await queryClient.cancelQueries()
  queryClient.clear()
}

/** Stores a new session's tokens and arms the refresh-before-expiry timer */
export function beginSession(tokens: AuthTokens, role?: string) {
  setAuthTokens(tokens, role)
  scheduleProactiveRefresh()
}

export async function endSession(queryClient: QueryClient) {
  cancelProactiveRefresh()
  clearAuthTokens()
  await resetUserState(queryClient)
}
