export interface RevenueReport {
  total: number
  count: number
  bookings: Array<{
    finalAmount: number
    createdAt: string
  }>
  groupBy: string
}
