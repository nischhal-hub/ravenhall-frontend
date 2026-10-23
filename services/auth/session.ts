import type { QueryClient } from "@tanstack/react-query"

import { clearAuthTokens } from "@/services/auth/token-store"

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

export async function endSession(queryClient: QueryClient) {
  clearAuthTokens()
  await resetUserState(queryClient)
}
