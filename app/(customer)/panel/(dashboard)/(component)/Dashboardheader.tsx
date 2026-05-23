"use client"

import { Shield, Zap } from "lucide-react"

interface User {
  firstName: string
  lastName: string
  email: string
}

interface Membership {
  plan: string
  isActive: boolean
  discountPct: number
  endDate: string
}

interface DashboardHeaderProps {
  user: User
  membership: Membership | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getGreeting(firstName: string) {
  const h = new Date().getHours()
  const time = h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"
  return `Good ${time}, ${firstName}`
}

export function DashboardHeader({ user, membership }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-primary px-4 py-12 sm:px-8">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(248 250 252) 1px, transparent 1px), linear-gradient(90deg, rgb(248 250 252) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-secondary opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          {/* Left: greeting */}
          <div>
            <p className="mb-1 text-xs font-bold tracking-widest text-accent uppercase">
              Dashboard
            </p>
            <h1 className="text-4xl font-black tracking-tight text-primary-foreground">
              {getGreeting(user.firstName)}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/60">
              {user.email}
            </p>
          </div>

          {/* Right: membership badge */}
          {membership?.isActive && (
            <div className="flex items-center gap-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-3 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                <Shield className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-accent uppercase">
                  {membership.plan} Member
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-primary-foreground/70" />
                  <span className="text-sm font-semibold text-primary-foreground/80">
                    {membership.discountPct}% off · expires{" "}
                    {formatDate(membership.endDate)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
