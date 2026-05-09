"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { useMeQuery } from "@/services/queries/auth"

type GuardRole = "admin" | "customer"

type AuthGuardProps = {
  role: GuardRole
  children: ReactNode
}

function normalizeRole(value: unknown): GuardRole | null {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.toLowerCase()
  if (normalized === "admin") {
    return "admin"
  }

  if (normalized === "customer") {
    return "customer"
  }

  return null
}

export function AuthGuard({ role, children }: AuthGuardProps) {
  const router = useRouter()
  const { data: user, isLoading, isError } = useMeQuery()
  console.log(user)

  const userRole = normalizeRole(user?.role)
  const isRoleMatch = userRole === role

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!user || isError) {
      router.replace(role === "admin" ? "/admin/auth" : "/auth")
      return
    }

    if (!isRoleMatch) {
      router.replace(role === "admin" ? "/panel" : "/admin")
    }
  }, [isLoading, isError, user, isRoleMatch, role, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking session...
      </div>
    )
  }

  if (!user || isError || !isRoleMatch) {
    return null
  }

  return <>{children}</>
}
