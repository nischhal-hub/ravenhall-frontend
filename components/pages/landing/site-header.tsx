"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { navLinks } from "@/components/pages/landing/data"
import { useMeQuery } from "@/services/queries/auth"
import { cn } from "@/lib/utils"

function normalizeRole(value: unknown) {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.toLowerCase()
  if (normalized === "customer") {
    return "customer"
  }

  if (normalized === "admin") {
    return "admin"
  }

  return null
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { data: user } = useMeQuery()
  const { resolvedTheme, setTheme } = useTheme()

  const isCustomer = normalizeRole(user?.role) === "customer"

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <header
      style={{ background: "var(--gradient-brand)" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#14263e] text-white shadow-md backdrop-blur-md transition-colors dark:border-white/5 dark:bg-[#070e17]"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-xs font-black tracking-wider text-accent-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            RH
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-black tracking-tight text-white italic leading-none sm:text-xl">
              Ravenhall <span className="text-accent">Cricket</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-white/70 uppercase">
              Indoor Centre
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "bg-white/15 font-bold text-white shadow-xs"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="size-9 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 hover:text-white"
          >
            {mounted ? (
              isDark ? (
                <Sun className="size-4 text-amber-300" />
              ) : (
                <Moon className="size-4 text-sky-200" />
              )
            ) : (
              <div className="size-4" />
            )}
          </Button>

          {isCustomer ? (
            <Button
              asChild
              className="h-10 rounded-xl bg-accent px-5 font-bold text-accent-foreground shadow-sm hover:bg-accent/90"
            >
              <Link href="/panel">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/auth">Login</Link>
              </Button>
              <Button
                asChild
                className="h-10 rounded-xl bg-accent px-5 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90"
              >
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="size-9 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            {mounted ? (
              isDark ? (
                <Sun className="size-4 text-amber-300" />
              ) : (
                <Moon className="size-4 text-sky-200" />
              )
            ) : (
              <div className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-xl text-white hover:bg-white/10 hover:text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <div className="border-t border-white/10 bg-[#0e1d30]/98 px-4 py-5 shadow-2xl backdrop-blur-xl md:hidden">
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-white/15 font-bold text-white shadow-xs"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <span className="size-2 rounded-full bg-accent" />
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <div className="mt-5 border-t border-white/10 pt-4">
            {isCustomer ? (
              <Button
                asChild
                className="h-11 w-full rounded-xl bg-accent font-bold text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/panel" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-white/20 bg-transparent text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/auth" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-11 rounded-xl bg-accent text-sm font-bold text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
