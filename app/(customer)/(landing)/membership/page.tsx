"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { planPointIcon } from "@/components/pages/landing/data"
import { Skeleton } from "@/components/ui/skeleton"
import { useMembershipPlansQuery } from "@/services/queries/membership.query"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawPlan {
  plan: string
  price: number
  discountPct: number
  durationDays: number
}

interface TransformedPlan {
  name: string
  price: string
  period: string
  featured: boolean
  highlight?: string
  points: string[]
  cta: string
  rawPlan: string
  discountPct: number
  durationDays: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPlanPoints(planType: string): string[] {
  switch (planType) {
    case "CASUAL":
      return ["Basic access", "Standard booking rates", "Community events"]
    case "MONTHLY":
      return [
        "10% discount on all bookings",
        "Priority booking access",
        "Monthly training credits",
        "Cancel anytime",
      ]
    case "ANNUAL":
      return [
        "20% discount on all bookings",
        "Priority booking + early access",
        "Monthly training credits",
        "Free guest passes",
        "VIP support",
      ]
    default:
      return []
  }
}

function transformPlan(plan: RawPlan): TransformedPlan {
  return {
    name:
      plan.plan === "MONTHLY"
        ? "Monthly"
        : plan.plan === "ANNUAL"
          ? "Annual"
          : "Casual",
    price: plan.price ? `$${plan.price.toFixed(2)}` : "$0",
    period:
      plan.plan === "ANNUAL"
        ? "/year"
        : plan.plan === "MONTHLY"
          ? "/month"
          : "",
    featured: plan.plan === "ANNUAL",
    highlight: plan.plan === "ANNUAL" ? "Best Value • Save 20%" : undefined,
    points: getPlanPoints(plan.plan),
    cta: plan.plan === "CASUAL" ? "Get Started Free" : "Subscribe Now",
    rawPlan: plan.plan,
    discountPct: plan.discountPct,
    durationDays: plan.durationDays,
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MembershipPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* top bar */}
      <div className="border-b border-border px-6 py-3">
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* heading */}
        <div className="mx-auto mb-12 max-w-xl space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-64 rounded-xl" />
          <Skeleton className="mx-auto h-5 w-80 rounded" />
        </div>

        {/* cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 rounded-3xl bg-muted p-7">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="mt-4 h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onSubscribe,
  isPending,
}: {
  plan: TransformedPlan
  onSubscribe: (plan: TransformedPlan) => void
  isPending: boolean
}) {
  const PointIcon = planPointIcon

  return (
    <article
      className={cn(
        "relative flex h-full flex-col justify-between rounded-3xl p-7 transition-transform duration-200 hover:-translate-y-1",
        plan.featured
          ? "bg-primary text-white shadow-[0_28px_60px_-24px_rgba(30,58,95,0.8)]"
          : "bg-muted text-foreground"
      )}
    >
      {plan.featured && (
        <p className="absolute top-0 right-4 rounded-b-2xl bg-accent px-4 py-1 text-[11px] font-black tracking-wider text-accent-foreground uppercase">
          Most Popular
        </p>
      )}

      <div>
        <h3 className="text-xl font-bold">{plan.name}</h3>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-black">{plan.price}</span>
          <span
            className={
              plan.featured ? "text-slate-200" : "text-muted-foreground"
            }
          >
            {plan.period}
          </span>
        </div>

        {plan.highlight && (
          <p
            className={cn(
              "mt-5 rounded-xl px-3 py-2 text-center text-xs font-semibold",
              plan.featured
                ? "bg-white/10 text-accent"
                : "bg-primary/10 text-primary"
            )}
          >
            {plan.highlight}
          </p>
        )}

        <ul className="mt-6 space-y-3 text-sm">
          {plan.points.map((point, index) => (
            <li key={index} className="flex items-center gap-2">
              <PointIcon
                className={cn(
                  "size-4 shrink-0",
                  plan.featured ? "text-accent" : "text-primary"
                )}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={cn(
          "mt-7 h-10 w-full text-sm font-semibold",
          plan.featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : ""
        )}
        variant={plan.featured ? "default" : "outline"}
        onClick={() => onSubscribe(plan)}
        disabled={isPending}
      >
        {isPending && plan.featured ? "Processing..." : plan.cta}
      </Button>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembershipPlansPage() {
  const router = useRouter()
  const { data, isLoading, error } = useMembershipPlansQuery()
  const plans: RawPlan[] = data?.data || []

  if (error) {
    console.error("Failed to load membership plans:", error)
  }

  const transformedPlans: TransformedPlan[] = plans.map(transformPlan)

  const handleSubscribe = (plan: TransformedPlan) => {
    if (plan.rawPlan === "CASUAL") {
      console.log("Activating casual plan")
      return
    }
    router.push(`/membership/checkout?plan=${plan.rawPlan}`)
  }

  if (isLoading) return <MembershipPageSkeleton />

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Choose your plan
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
            Membership Plans
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Unlock exclusive rates, priority bookings, and premium training
            perks.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Failed to load plans. Please refresh the page.
          </div>
        )}

        {/* Plan cards */}
        {transformedPlans.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {transformedPlans.map((plan) => (
              <PlanCard
                key={plan.rawPlan}
                plan={plan}
                onSubscribe={handleSubscribe}
                isPending={false}
              />
            ))}
          </div>
        ) : (
          !error && (
            <p className="text-center text-sm text-muted-foreground">
              No membership plans available at the moment.
            </p>
          )
        )}

        {/* Fine print */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          All prices are in AUD and include GST. Cancel or change your plan at
          any time.
        </p>
      </div>
    </div>
  )
}
