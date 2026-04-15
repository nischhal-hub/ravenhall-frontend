"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { navLinks } from "@/components/landing/data"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

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
          <Button variant="ghost" size="lg" className="px-4 text-primary">
            Login
          </Button>
          <Button size="lg" className="px-4 font-semibold">
            Register
          </Button>
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
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-9">
              Login
            </Button>
            <Button className="h-9">Register</Button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
