"use client"

import { useSearchParams } from "next/navigation"
import { Clock } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  SESSION_EXPIRED_MESSAGE,
  SESSION_EXPIRED_REASON,
} from "@/services/auth/refresh"

/** Shown on the login form after the session ran out (`?reason=session-expired`) */
export function SessionExpiredNotice() {
  const searchParams = useSearchParams()
  if (searchParams.get("reason") !== SESSION_EXPIRED_REASON) return null

  return (
    <Alert className="mb-5 px-3.5 py-3" role="status">
      <Clock className="text-muted-foreground" />
      <AlertDescription className="text-sm text-foreground">
        {SESSION_EXPIRED_MESSAGE}
      </AlertDescription>
    </Alert>
  )
}
