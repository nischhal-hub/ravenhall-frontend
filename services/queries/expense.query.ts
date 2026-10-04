import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import type {
  ExpenseApiResponse,
  ExpenseCategoriesApiResponse,
  ExpenseCategory,
  ExpenseCategoryApiResponse,
  ExpenseFilterParams,
  ExpensesApiResponse,
  ExpenseSummaryApiResponse,
  ExpenseSummaryParams,
} from '@/types/expense-response.types'

/**
 * Fetch paginated expenses with filters (search, category, payment method, date range)
 */
export function useExpensesQuery(filters: ExpenseFilterParams = {}) {
  const {
    page = 1,
    limit = 15,
    search = '',
    categoryId,
    paymentMethod,
    from,
    to,
    sortBy = 'expenseDate',
    order = 'desc',
  } = filters

  return useQuery<ExpensesApiResponse, Error>({
    queryKey: ['expenses', page, limit, search, categoryId, paymentMethod, from, to, sortBy, order],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit,
        sortBy,
        order,
      }
      if (search) params.search = search
      if (categoryId && categoryId !== 'ALL') params.categoryId = categoryId
      if (paymentMethod && paymentMethod !== 'ALL') params.paymentMethod = paymentMethod
      if (from) params.from = from
      if (to) params.to = to

      const res = await apiClient.get<ExpensesApiResponse>('/expenses', { params })
      return res.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Fetch single expense by ID
 */
export function useExpenseByIdQuery(id?: string) {
  return useQuery<ExpenseApiResponse, Error>({
    queryKey: ['expense', id],
    queryFn: async () => {
      const res = await apiClient.get<ExpenseApiResponse>(`/expenses/${id}`)
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
  })
}

/**
 * Fetch expense analytics summary (total spent, by category, by payment method, timeline)
 */
export function useExpenseSummaryQuery(params: ExpenseSummaryParams = {}) {
  const { from, to, categoryId, groupBy = 'month' } = params

  return useQuery<ExpenseSummaryApiResponse, Error>({
    queryKey: ['expense-summary', from, to, categoryId, groupBy],
    queryFn: async () => {
      const queryParams: Record<string, string> = { groupBy }
      if (from) queryParams.from = from
      if (to) queryParams.to = to
      if (categoryId && categoryId !== 'ALL') queryParams.categoryId = categoryId

      const res = await apiClient.get<ExpenseSummaryApiResponse>('/expenses/summary', {
        params: queryParams,
      })
      return res.data
    },
    staleTime: 1000 * 60 * 3,
  })
}

/**
 * Fetch all expense categories with counts and totals
 */
export function useExpenseCategoriesQuery() {
  return useQuery<ExpenseCategoriesApiResponse, Error>({
    queryKey: ['expense-categories'],
    queryFn: async () => {
      const res = await apiClient.get<ExpenseCategoriesApiResponse>('/expense-categories')
      return res.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Fetch single expense category by ID
 */
export function useExpenseCategoryByIdQuery(id?: string) {
  return useQuery<ExpenseCategoryApiResponse, Error>({
    queryKey: ['expense-category', id],
    queryFn: async () => {
      const res = await apiClient.get<ExpenseCategoryApiResponse>(`/expense-categories/${id}`)
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}
