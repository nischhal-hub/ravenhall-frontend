export interface MembershipPlan {
  plan: "CASUAL" | "MONTHLY" | "ANNUAL"
  discountPct: number
  durationDays: number
}

export interface MembershipPlansApiResponse {
  status: string
  message: string
  data: MembershipPlan[]
}
