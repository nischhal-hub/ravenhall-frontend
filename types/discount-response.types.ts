export interface Discount {
  id: string
  code: string
  description: string | null
  discountPct: number
  maxUses: number | null
  usedCount: number
  validFrom: string
  validTo: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DiscountApiResponse {
  status: string
  message: string
  data: Discount[]
}
