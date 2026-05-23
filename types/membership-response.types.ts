export interface MembershipPlan {
  plan: "CASUAL" | "MONTHLY" | "ANNUAL"
  discountPct: number
  durationDays: number
  isActive: boolean
}

export interface MembershipPlansApiResponse {
  status: string
  message: string
  data: MembershipPlan[]
}
