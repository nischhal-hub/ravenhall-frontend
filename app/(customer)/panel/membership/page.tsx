"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  CalendarDays,
  Zap,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PanelHero } from "@/components/panel/panel-hero"
import {
  MembershipStatusBadge,
  PaymentStatusBadge,
} from "@/components/reusable/status-badge"
import { formatCurrency } from "@/lib/utils"
import { useMyMembershipQuery } from "@/services/queries/membership.query"

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/** Returns days remaining (negative = expired) */
function daysRemaining(endDate: string): number {
  const now = new Date()
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/** 0–1 progress through the membership period */
function periodProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  return Math.min(1, Math.max(0, (now - start) / (end - start)))
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Animated circular countdown ring */
function DaysRing({ days, total }: { days: number; total: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const progress = Math.max(0, days / total)
  const dash = circ * progress
  const urgent = days <= 30

  return (
    <div className="relative flex items-center justify-center">
      <svg width={128} height={128} className="-rotate-90">
        {/* track */}
        <circle
          cx={64}
          cy={64}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={8}
        />
        {/* progress arc */}
        <circle
          cx={64}
          cy={64}
          r={r}
          fill="none"
          stroke={urgent ? "var(--destructive)" : "var(--accent)"}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`text-3xl leading-none font-black tabular-nums ${urgent ? "text-destructive" : "text-accent"}`}
        >
          {days}
        </span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          days left
        </span>
      </div>
    </div>
  )
}

/** Thin progress bar for the subscription period */
function PeriodBar({ progress }: { progress: number }) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-1000"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

/** Single stat tile */
function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {accent && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle at top left, var(--accent), transparent 70%)",
          }}
        />
      )}
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${accent ? "bg-accent" : "bg-muted"}`}
      >
        <Icon
          className={`h-4 w-4 ${accent ? "text-accent-foreground" : "text-muted-foreground"}`}
        />
      </div>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-xl leading-tight font-bold text-foreground">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

/** Perk row */
function PerkRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 border-b border-border py-2.5 last:border-0">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
      </div>
      <span className="text-sm text-foreground">{text}</span>
    </li>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// No membership state
// ─────────────────────────────────────────────────────────────────────────────
function NoMembership({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border">
        <Shield className="h-9 w-9 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        No Active Membership
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Join a membership plan to unlock discounts, priority booking, and
        exclusive lane access.
      </p>
      <Button onClick={onJoin} className="mt-8 h-12 w-full rounded-xl text-base font-bold">
        View Plans <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function MembershipPage() {
  const router = useRouter()
  const { data, isLoading, isError, error } = useMyMembershipQuery()
  // @ts-expect-error dddd
  const membership = data?.data || null

  const days = useMemo(
    () => (membership ? daysRemaining(membership.endDate) : 0),
    [membership]
  )
  const totalDays = useMemo(() => {
    if (!membership) return 365
    const s = new Date(membership.createdAt).getTime()
    const e = new Date(membership.endDate).getTime()
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24))
  }, [membership])
  const progress = useMemo(
    () =>
      membership ? periodProgress(membership.createdAt, membership.endDate) : 0,
    [membership]
  )

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return <PageSkeleton />

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !membership) {
    const msg =
      error instanceof Error ? error.message : "Could not load membership."
    // If 404-ish, show the "no membership" state
    if (msg.toLowerCase().includes("not found") || msg.includes("404")) {
      return <NoMembership onJoin={() => router.push("/membership/plans")} />
    }
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold text-foreground">
          Failed to load membership
        </p>
        <p className="text-sm text-muted-foreground">{msg}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      </div>
    )
  }

  // ── Plan perks ───────────────────────────────────────────────────────────
  const perks =
    membership.plan === "ANNUAL"
      ? [
          `${membership.discountPct}% discount on all lane bookings`,
          "VIP priority booking access",
          "Free guest passes included",
          "Exclusive member-only events",
        ]
      : [
          `${membership.discountPct}% discount on all lane bookings`,
          "Priority booking access",
          "Member-only rates",
        ]

  const isExpired = days <= 0
  const isUrgent = days > 0 && days <= 30

  return (
    <>
      {/* ── Keyframe animations ─────────────────────────────────────────── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .anim { animation: fadeUp 0.5s ease both; }
        .d1  { animation-delay: 0.05s; }
        .d2  { animation-delay: 0.12s; }
        .d3  { animation-delay: 0.19s; }
        .d4  { animation-delay: 0.26s; }
        .d5  { animation-delay: 0.33s; }
        .d6  { animation-delay: 0.40s; }
      `}</style>

      <div className="min-h-screen bg-background pb-20">
        <PanelHero
          eyebrow={`${membership.plan} Member`}
          eyebrowIcon={Shield}
          title="Your Membership"
          description={`Member since ${formatDate(membership.createdAt)}`}
          actions={
            <MembershipStatusBadge
              status={isExpired ? "expired" : isUrgent ? "expiring" : "active"}
            />
          }
        />

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl space-y-6 px-4 pt-8">
          {/* ── Stat grid ─────────────────────────────────────────────── */}
          <div className="anim d3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              icon={Zap}
              label="Discount"
              value={`${membership.discountPct}% off`}
              sub="On all lane bookings"
              accent
            />
            <StatTile
              icon={TrendingUp}
              label="Plan"
              value={membership.plan === "ANNUAL" ? "Annual" : "Monthly"}
              sub={membership.plan === "ANNUAL" ? "Best value" : "Flexible"}
            />
            <StatTile
              icon={CreditCard}
              label="Amount Paid"
              value={
                membership.payment
                  ? formatCurrency(membership.payment.amount)
                  : "—"
              }
              sub={
                membership.payment?.paidAt
                  ? `Paid ${formatDate(membership.payment.paidAt)}`
                  : undefined
              }
            />
            <StatTile
              icon={CalendarDays}
              label="Renews / Expires"
              value={formatDate(membership.endDate)}
              sub={isExpired ? "Expired" : `${days} days remaining`}
            />
          </div>

          {/* ── Middle row ────────────────────────────────────────────── */}
          <div className="anim d4 grid gap-6 lg:grid-cols-3">
            {/* Countdown + timeline */}
            <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-foreground">
                    Subscription Period
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(membership.createdAt)} →{" "}
                    {formatDate(membership.endDate)}
                  </p>
                </div>
                {isUrgent && !isExpired && (
                  <Badge variant="destructive" className="gap-1">
                    <Clock className="h-3 w-3" /> Renew soon
                  </Badge>
                )}
              </div>

              {/* Ring + bar layout */}
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <DaysRing days={Math.max(0, days)} total={totalDays} />

                <div className="w-full flex-1 space-y-4">
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>Period used</span>
                      <span>{Math.round(progress * 100)}%</span>
                    </div>
                    <PeriodBar progress={progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Started</p>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {formatDate(membership.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="text-xs text-muted-foreground">Ends</p>
                      <p
                        className={`mt-0.5 font-semibold ${isUrgent || isExpired ? "text-destructive" : "text-foreground"}`}
                      >
                        {formatDate(membership.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Renew CTA */}
              {(isUrgent || isExpired) && (
                <Button
                  onClick={() => router.push("/membership/plans")}
                  className="mt-2 h-11 w-full rounded-xl font-bold"
                >
                  {isExpired ? "Renew Membership" : "Renew Early"}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Perks card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h2 className="font-bold text-foreground">Your Benefits</h2>
              </div>
              <ul className="divide-y divide-border">
                {perks.map((p) => (
                  <PerkRow key={p} text={p} />
                ))}
              </ul>
            </div>
          </div>

          {/* ── Payment info ───────────────────────────────────────────── */}
          {membership.payment && (
            <div className="anim d5 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-bold text-foreground">
                Payment Details
              </h2>
              <div className="grid gap-px overflow-hidden rounded-xl border border-border">
                {[
                  {
                    label: "Payment ID",
                    value: membership.payment.id,
                    mono: true,
                  },
                  {
                    label: "Amount",
                    value: formatCurrency(membership.payment.amount),
                  },
                  {
                    label: "Paid at",
                    value: membership.payment.paidAt
                      ? formatDate(membership.payment.paidAt)
                      : "—",
                  },
                ].map(({ label, value, mono }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between bg-card px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                    <span
                      className={`text-sm font-semibold text-foreground ${mono ? "font-mono text-xs" : ""}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <PaymentStatusBadge status={membership.payment.status} />
                </div>
              </div>
            </div>
          )}

          {/* ── Footer actions ─────────────────────────────────────────── */}
          <div className="anim d6 flex flex-wrap gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="h-11 rounded-xl px-6 font-semibold"
            >
              Go to Dashboard
            </Button>
            {/* Renew/Upgrade already surfaced above when urgent or expired —
                only offer it here as a secondary action otherwise. */}
            {!isUrgent && !isExpired && (
              <Button
                onClick={() => router.push("/membership/plans")}
                className="h-11 rounded-xl px-6 font-semibold"
              >
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
