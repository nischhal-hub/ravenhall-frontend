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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-50/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-black tracking-tight text-primary italic sm:text-2xl"
        >
          Ravenhall Cricket
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isCustomer ? (
            <Button asChild size="lg" className="px-4 font-semibold">
              <Link href="/panel">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="px-4 text-primary"
              >
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild size="lg" className="px-4 font-semibold">
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 md:hidden">
          <nav className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {isCustomer ? (
            <div className="mt-4">
              <Button asChild className="h-9 w-full">
                <Link href="/panel" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="h-9">
                <Link href="/auth" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild className="h-9">
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
