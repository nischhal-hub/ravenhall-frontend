"use client"

import { MembershipPlan } from "@/types/membership-response.types"
import { User } from "@/types/user-response.types"

interface Props {
  user: User
  membership: MembershipPlan | null
}

export function UserDashboardHeader({ user, membership }: Props) {
  const greeting = `Good ${new Date().getHours() < 12 ? "Morning" : "Afternoon"}, ${user.firstName}!`

  return (
    <div className="flex flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      {membership?.isActive && (
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          {membership.plan} Member • {membership.discountPct}% Off
        </div>
      )}
    </div>
  )
}
