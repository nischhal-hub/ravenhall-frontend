"use client"

import { Button } from "@/components/ui/button"
import { MembershipPlans } from "@/components/membership/membership-plans"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function MembershipPlansPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6">
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
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

        <MembershipPlans />

        {/* Fine print */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          All prices are in AUD and include GST. Cancel or change your plan at
          any time.
        </p>
      </div>
    </div>
  )
}
