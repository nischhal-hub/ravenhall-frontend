"use client"

import MembershipCheckout from "@/components/membership/checkout"
import { useSearchParams } from "next/navigation"

export default function MembershipCheckoutPage() {
  const searchParams = useSearchParams()
  const plan = (searchParams.get("plan") || "") as string

  type PlanKey = "MONTHLY" | "ANNUAL"
  const PLANS: Record<PlanKey, { name: string; price: number }> = {
    MONTHLY: { name: "Monthly Membership", price: 29.99 },
    ANNUAL: { name: "Annual Membership", price: 299.99 },
  }

  const planInfo = PLANS[plan as PlanKey]

  if (!planInfo) {
    return <p>Invalid plan</p>
  }

  return (
    <MembershipCheckout
      plan={plan}
      planName={planInfo.name}
      price={planInfo.price}
    />
  )
}
