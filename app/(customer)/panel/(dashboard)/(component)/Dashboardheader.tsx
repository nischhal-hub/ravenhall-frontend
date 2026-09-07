"use client"

import { Shield, Zap } from "lucide-react"
import { PanelHero } from "@/components/panel/panel-hero"

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
    <PanelHero
      eyebrow="Dashboard"
      title={getGreeting(user.firstName)}
      description={user.email}
      actions={
        membership?.isActive ? (
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
        ) : undefined
      }
    />
  )
}
