export type ReportGroupByInterval = 'day' | 'week' | 'month' | 'year'

export interface RevenueReportQueryParams {
  from?: string
  to?: string
  groupBy?: ReportGroupByInterval
}

export interface RevenueTrendsQueryParams {
  from?: string
  to?: string
  interval?: ReportGroupByInterval
}

export interface PeriodFinancialMetric {
  period: string
  revenue: number
  expenses: number
  netProfit: number
  profitMarginPct: number
  bookingCount: number
  expenseCount: number
}

export interface ReportCategoryExpenseBreakdown {
  categoryId: string
  categoryName: string
  total: number
  count: number
  percentage: number
}

export interface RevenueSourceMetric {
  total: number
  count: number
}

export interface RevenueSourceBreakdown {
  onlineBookings: RevenueSourceMetric
  posBookings: RevenueSourceMetric
  memberships: RevenueSourceMetric
}

export interface PaymentMethodBreakdown {
  method: string
  total: number
  count: number
  percentage: number
}

export interface RecentRevenueItem {
  id: string
  date: string
  amount: number
  paymentMethod: string
  source: string
  reference: string
}

export interface RecentExpenseItem {
  id: string
  date: string
  title: string
  amount: number
  categoryName: string
  paymentMethod: string
}

export interface RevenueReportResult {
  dateRange: {
    from: string
    to: string
  }
  groupBy: ReportGroupByInterval
  summary: {
    grossRevenue: number
    totalRefunds: number
    netRevenue: number
    totalExpenses: number
    netProfit: number
    profitMarginPct: number
    totalBookings: number
    totalExpensesCount: number
  }
  revenueBySource: RevenueSourceBreakdown
  revenueByPaymentMethod: PaymentMethodBreakdown[]
  expensesByCategory: ReportCategoryExpenseBreakdown[]
  timeline: PeriodFinancialMetric[]
  recentTransactions: {
    revenues: RecentRevenueItem[]
    expenses: RecentExpenseItem[]
  }
}

export interface RevenueSummaryResult {
  dateRange: {
    from: string
    to: string
  }
  totalGrossRevenue: number
  totalRefunds: number
  totalNetRevenue: number
  totalExpenses: number
  netProfit: number
  profitMarginPct: number
  bookingMetrics: {
    totalBookings: number
    avgRevenuePerBooking: number
  }
  revenueBySource: RevenueSourceBreakdown
  revenueByPaymentMethod: PaymentMethodBreakdown[]
  topExpenseCategory: {
    name: string
    amount: number
    percentage: number
  } | null
}

export interface RevenueTrendsPoint extends PeriodFinancialMetric {
  revenueGrowthPct: number | null
  expenseGrowthPct: number | null
}

export interface RevenueTrendsResult {
  dateRange: {
    from: string
    to: string
  }
  interval: ReportGroupByInterval
  trends: RevenueTrendsPoint[]
}

// API Response wrappers
export interface RevenueReportApiResponse {
  status: string
  message?: string
  data: RevenueReportResult
}

export interface RevenueSummaryApiResponse {
  status: string
  message?: string
  data: RevenueSummaryResult
}

export interface RevenueTrendsApiResponse {
  status: string
  message?: string
  data: RevenueTrendsResult
}
