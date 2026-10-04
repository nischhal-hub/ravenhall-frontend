import { PosPaymentMethod } from "./pos-response.types"

export type ExpensePaymentMethod = "STRIPE" | "CASH" | "CARD" | "BANK_TRANSFER" | "OTHER"

export interface ExpenseCategory {
  id: string
  name: string
  description: string | null
  isDefault: boolean
  expenseCount: number
  totalSpent: number
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  title: string
  amount: number
  categoryId: string
  category: {
    id: string
    name: string
    description?: string | null
    isDefault?: boolean
  }
  description: string | null
  expenseDate: string
  paymentMethod: ExpensePaymentMethod
  receiptUrl: string | null
  receiptPublicId: string | null
  createdById: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
    role?: string
  }
  createdAt: string
  updatedAt: string
}

export interface ExpenseFilterParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  paymentMethod?: ExpensePaymentMethod | string
  from?: string
  to?: string
  sortBy?: "expenseDate" | "amount" | "title" | "createdAt" | string
  order?: "asc" | "desc"
}

export interface ExpenseSummaryParams {
  from?: string
  to?: string
  categoryId?: string
  groupBy?: "day" | "week" | "month" | "year"
}

export interface CategoryExpenseBreakdown {
  categoryId: string
  categoryName: string
  total: number
  count: number
  percentage: number
}

export interface PaymentMethodExpenseBreakdown {
  method: string
  total: number
  count: number
  percentage: number
}

export interface ExpenseTimelinePoint {
  period: string
  total: number
  count: number
}

export interface ExpenseSummary {
  dateRange: {
    from: string | null
    to: string | null
  }
  totalExpenses: number
  expenseCount: number
  byCategory: CategoryExpenseBreakdown[]
  byPaymentMethod: PaymentMethodExpenseBreakdown[]
  timeline: ExpenseTimelinePoint[]
}

export interface ExpensesApiResponse {
  status: string
  message?: string
  data: {
    expenses: Expense[]
    totalAmount: number
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface ExpenseApiResponse {
  status: string
  message?: string
  data: Expense
}

export interface ExpenseCategoriesApiResponse {
  status: string
  message?: string
  data: ExpenseCategory[]
}

export interface ExpenseCategoryApiResponse {
  status: string
  message?: string
  data: ExpenseCategory
}

export interface ExpenseSummaryApiResponse {
  status: string
  message?: string
  data: ExpenseSummary
}
