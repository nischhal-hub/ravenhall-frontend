import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api/client'
import { toast } from 'sonner'
import type {
  ExpenseApiResponse,
  ExpenseCategoryApiResponse,
} from '@/types/expense-response.types'
import type { ExpenseCategoryFormData } from '@/schemas/expense'

// ================== EXPENSE MUTATIONS ==================

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation<ExpenseApiResponse, Error, FormData | Record<string, any>>({
    mutationKey: ['expenses', 'create'],
    mutationFn: async (payload) => {
      const isFormData = typeof window !== 'undefined' && payload instanceof FormData
      const res = await apiClient.post<ExpenseApiResponse>('/expenses', payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      })
      return res.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-summary'] })
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-report'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-summary'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-trends'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Expense "${res.data.title}" added successfully`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to create expense'
      toast.error(message)
    },
  })
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    ExpenseApiResponse,
    Error,
    { id: string; payload: FormData | Record<string, any> }
  >({
    mutationKey: ['expenses', 'update'],
    mutationFn: async ({ id, payload }) => {
      const isFormData = typeof window !== 'undefined' && payload instanceof FormData
      const res = await apiClient.patch<ExpenseApiResponse>(`/expenses/${id}`, payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      })
      return res.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense', res.data.id] })
      queryClient.invalidateQueries({ queryKey: ['expense-summary'] })
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-report'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-summary'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-trends'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`Expense "${res.data.title}" updated successfully`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to update expense'
      toast.error(message)
    },
  })
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string; id: string }, Error, string>({
    mutationKey: ['expenses', 'delete'],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/expenses/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-summary'] })
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-report'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-summary'] })
      queryClient.invalidateQueries({ queryKey: ['revenue-trends'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Expense deleted successfully')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to delete expense'
      toast.error(message)
    },
  })
}

// ================== CATEGORY MUTATIONS ==================

export function useCreateExpenseCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation<ExpenseCategoryApiResponse, Error, ExpenseCategoryFormData>({
    mutationKey: ['expense-categories', 'create'],
    mutationFn: async (payload) => {
      const res = await apiClient.post<ExpenseCategoryApiResponse>('/expense-categories', payload)
      return res.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
      toast.success(`Category "${res.data.name}" created`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to create category'
      toast.error(message)
    },
  })
}

export function useUpdateExpenseCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    ExpenseCategoryApiResponse,
    Error,
    { id: string; payload: Partial<ExpenseCategoryFormData> }
  >({
    mutationKey: ['expense-categories', 'update'],
    mutationFn: async ({ id, payload }) => {
      const res = await apiClient.patch<ExpenseCategoryApiResponse>(
        `/expense-categories/${id}`,
        payload
      )
      return res.data
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success(`Category "${res.data.name}" updated`)
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to update category'
      toast.error(message)
    },
  })
}

export function useDeleteExpenseCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string; id: string }, Error, string>({
    mutationKey: ['expense-categories', 'delete'],
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/expense-categories/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to delete category'
      toast.error(message)
    },
  })
}
