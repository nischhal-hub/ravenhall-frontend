"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { planPointIcon } from "@/components/pages/landing/data"
import { Skeleton } from "@/components/ui/skeleton"
import { useMembershipPlansQuery } from "@/services/queries/membership.query"
import {
  useCreateMembershipPaymentIntent,
  useConfirmMembershipPayment,
} from "@/services/mutations/membership.mutations" // Adjust path as needed
import { useRouter } from "next/navigation"

export function MembershipSection() {
  const PointIcon = planPointIcon
  const router = useRouter()

  const { data, isLoading, error } = useMembershipPlansQuery()
  const plans = data?.data || []

  const createIntent = useCreateMembershipPaymentIntent()
  const confirmPayment = useConfirmMembershipPayment()

  if (error) {
    console.error("Failed to load membership plans:", error)
  }

  // Transform API data
  const transformedPlans =
    plans?.map((plan: any) => ({
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
    })) || []

  const handleSubscribe = (plan: any) => {
    if (plan.rawPlan === "CASUAL") {
      console.log("Activating casual plan")
      return
    }

    // Navigate to checkout page
    router.push(`/membership/checkout?plan=${plan.rawPlan}`)
  }

  if (isLoading) {
    return <MembershipSectionSkeleton />
  }

  return (
    <section
      id="memberships"
      className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
            Membership Plans
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Unlock exclusive rates, priority bookings, and premium training
            perks.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {transformedPlans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex h-full flex-col justify-between rounded-3xl p-7",
                plan.featured
                  ? "bg-primary text-primary-foreground shadow-[0_28px_60px_-24px_rgba(30,58,95,0.8)]"
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
                        ? "bg-primary-foreground/10 text-accent"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {plan.highlight}
                  </p>
                )}

                <ul className="mt-6 space-y-3 text-sm">
                  {plan.points.map((point: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <PointIcon
                        className={cn(
                          "size-4",
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
                onClick={() => handleSubscribe(plan)}
                disabled={createIntent.isPending}
              >
                {createIntent.isPending ? "Processing..." : plan.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Plan benefits
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

// Loading Skeleton
function MembershipSectionSkeleton() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Skeleton className="mx-auto h-10 w-80" />
          <Skeleton className="mx-auto mt-3 h-5 w-96" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl bg-muted p-7">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="mt-4 h-12 w-32" />
              <Skeleton className="mt-6 h-4 w-full" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-3 h-4 w-11/12" />
              <Skeleton className="mt-8 h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
