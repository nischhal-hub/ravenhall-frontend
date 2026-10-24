export interface MembershipPlan {
  plan: "CASUAL" | "MONTHLY" | "ANNUAL"
  discountPct: number
  durationDays: number
  /** AUD; 0 for CASUAL */
  price: number
  isActive: boolean
}

export interface MembershipPlansApiResponse {
  status: string
  message: string
  data: MembershipPlan[]
}
