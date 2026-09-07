"use client"

import { Shield, ChevronRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/reusable/empty-state"
import { MembershipStatusBadge } from "@/components/reusable/status-badge"
import { useRouter } from "next/navigation"

interface Membership {
  plan: string
  isActive: boolean
  discountPct: number
  endDate: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function daysLeft(endDate: string) {
  return Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
}

const PERKS: Record<string, string[]> = {
  ANNUAL: ["20% lane discount", "VIP priority access", "Guest passes"],
  MONTHLY: ["10% lane discount", "Priority booking"],
}

export function MembershipCard({
  membership,
}: {
  membership: Membership | null
}) {
  const router = useRouter()

  if (!membership?.isActive) {
    return (
      <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-border bg-card p-8">
        <EmptyState
          icon={Shield}
          title="No Membership"
          description="Unlock discounts and priority access"
          action={
            <Button
              className="w-full rounded-xl font-semibold"
              onClick={() => router.push("/membership")}
            >
              View Plans <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          }
        />
      </div>
    )
  }

  const days = daysLeft(membership.endDate)
  const urgent = days <= 30
  const perks = PERKS[membership.plan] ?? []

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      {/* Top */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Membership
          </p>
          <p className="font-black text-foreground">{membership.plan}</p>
        </div>
        <span className="ml-auto">
          <MembershipStatusBadge status="active" />
        </span>
      </div>

      {/* Days ring mini */}
      <div
        className={`mb-5 rounded-xl p-4 ${urgent ? "bg-destructive/10" : "bg-muted/50"}`}
      >
        <p
          className={`text-xs font-semibold ${urgent ? "text-destructive" : "text-muted-foreground"}`}
        >
          {urgent ? "⚠ Expiring soon" : "Days remaining"}
        </p>
        <p
          className={`mt-1 text-3xl font-black tabular-nums ${urgent ? "text-destructive" : "text-foreground"}`}
        >
          {Math.max(0, days)}
          <span className="ml-1 text-sm font-medium text-muted-foreground">
            days
          </span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Until {formatDate(membership.endDate)}
        </p>
      </div>

      {/* Perks */}
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Benefits
        </p>
      </div>
      <ul className="space-y-2">
        {perks.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2.5 text-sm text-foreground"
          >
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
            {p}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant="outline"
        className="mt-auto w-full rounded-xl font-semibold"
        onClick={() => router.push("/membership")}
      >
        View Membership
      </Button>
    </div>
  )
}
