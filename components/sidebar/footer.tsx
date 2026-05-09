"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMeQuery } from "@/services/queries/auth"
import { useLogoutMutation } from "@/services/mutations/auth.mutations"
import { clearAuthTokens, getRefreshToken } from "@/services/auth/token-store"

type WebSidebarFooterProps = {
  isCollapsed: boolean
  role?: "admin" | "customer"
  profileHref?: string
}

function buildDisplayName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim()
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean)
  if (parts.length === 0) {
    return "RH"
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase()
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

export default function WebSidebarFooter({
  isCollapsed,
  role = "customer",
  profileHref,
}: WebSidebarFooterProps) {
  const router = useRouter()
  const { data: user } = useMeQuery()
  const logoutMutation = useLogoutMutation()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const displayName =
    buildDisplayName(user?.firstName, user?.lastName) ||
    (role === "admin" ? "Admin account" : "Customer account")
  const email = user?.email ?? "Signed in"
  const initials = getInitials(displayName)
  const isDark = resolvedTheme === "dark"
  const profileLink =
    profileHref ?? (role === "admin" ? "/admin/users" : "/panel/settings")

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      const refreshToken = getRefreshToken()
      await logoutMutation.mutateAsync(
        refreshToken ? { refreshToken } : undefined
      )
    } catch (error) {
      // Ignore server logout errors to ensure local session is cleared.
    } finally {
      clearAuthTokens()
      setOpen(false)
      router.replace(role === "admin" ? "/admin/auth" : "/auth")
      setIsLoggingOut(false)
    }
  }

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Open profile menu"
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
              {initials}
            </span>
            {!isCollapsed ? (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">
                  {displayName}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {email}
                </span>
              </span>
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent align={isCollapsed ? "center" : "start"} side="top">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold">{displayName}</p>
              <p className="text-[11px] text-muted-foreground">{email}</p>
            </div>
            <div className="grid gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link href={profileLink} onClick={() => setOpen(false)}>
                  View profile
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleTheme}
              >
                {isDark ? <Sun /> : <Moon />}
                {isDark ? "Light mode" : "Dark mode"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
