"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { planPointIcon } from "@/components/pages/landing/data"
import { Skeleton } from "@/components/ui/skeleton"
import { useMembershipPlansQuery } from "@/services/queries/membership.query"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RawPlan {
  plan: string
  price: number
  discountPct: number
  durationDays: number
}

export interface TransformedPlan {
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

export function MembershipPlansSkeleton() {
  return (
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
          ? "bg-primary text-primary-foreground shadow-[0_28px_60px_-24px_rgba(190,18,60,0.45)]"
          : "bg-muted text-foreground"
      )}
    >
      {plan.featured && (
        <p className="absolute top-0 right-4 rounded-b-2xl bg-highlight px-4 py-1 text-[11px] font-black tracking-wider text-highlight-foreground uppercase">
          Most Popular
        </p>
      )}

      <div>
        <h3 className="text-xl font-bold">{plan.name}</h3>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-black">{plan.price}</span>
          <span
            className={
              plan.featured
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
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
                ? "bg-primary-foreground/10 text-highlight-soft"
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
                  plan.featured ? "text-highlight-soft" : "text-primary"
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

// ─── Grid ─────────────────────────────────────────────────────────────────────

/**
 * Plan cards with data fetching built in. Shared by the public plans page and
 * the customer panel's "no membership" state. Subscribing sends the user to
 * the same checkout flow either way.
 */
export function MembershipPlans() {
  const router = useRouter()
  const { data, isLoading, error } = useMembershipPlansQuery()
  //   @ts-expect-error API wraps the plans in `data`
  const plans: RawPlan[] = data?.data || []

  const handleSubscribe = (plan: TransformedPlan) => {
    if (plan.rawPlan === "CASUAL") {
      console.log("Activating casual plan")
      return
    }
    router.push(`/membership/checkout?plan=${plan.rawPlan}`)
  }

  if (isLoading) return <MembershipPlansSkeleton />

  const transformedPlans = plans.map(transformPlan)

  return (
    <>
      {error && (
        <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load plans. Please refresh the page.
        </div>
      )}

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
    </>
  )
}
