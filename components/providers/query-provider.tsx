"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
  setSessionExpiredHandler,
  startSessionSync,
} from "@/services/auth/refresh"
import { endSession } from "@/services/auth/session"

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  )

  // An expired session ends through the normal logout path (tokens + cache);
  // the refresh timer and cross-tab sync run for the life of the tab
  useEffect(() => {
    setSessionExpiredHandler(() => endSession(queryClient))
    const stopSync = startSessionSync()
    return () => {
      stopSync()
      setSessionExpiredHandler(null)
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
