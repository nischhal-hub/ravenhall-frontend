"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { navLinks } from "@/components/pages/landing/data"
import { useMeQuery } from "@/services/queries/auth"

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
  const { data: user } = useMeQuery()
  const isCustomer = normalizeRole(user?.role) === "customer"

  return (
    // Same brand surface as SiteFooter so the page opens and closes alike
    <header
      style={{ background: "var(--gradient-brand)" }}
      className="sticky top-0 z-50 border-b border-white/10 text-white shadow-sm"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded font-heading text-xl font-black tracking-tight text-white italic outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-2xl"
        >
          Ravenhall Cricket
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded text-sm font-semibold text-white/80 transition outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isCustomer ? (
            <Button
              asChild
              size="lg"
              className="bg-white px-4 font-semibold text-primary hover:bg-white/90"
            >
              <Link href="/panel">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="border border-white/30 px-4 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/auth">Login</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white px-4 font-semibold text-primary hover:bg-white/90"
              >
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-white hover:bg-white/10 hover:text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <nav className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {isCustomer ? (
            <div className="mt-4">
              <Button
                asChild
                className="h-11 w-full bg-white text-primary hover:bg-white/90"
              >
                <Link href="/panel" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                asChild
                variant="outline"
                className="h-11 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/auth" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 bg-white text-primary hover:bg-white/90"
              >
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  )
}
