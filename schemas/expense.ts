import { z } from 'zod'

export const expensePaymentMethods = ['STRIPE', 'CASH', 'CARD', 'BANK_TRANSFER', 'OTHER'] as const

export const expenseCategoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().or(z.literal('')),
})

export type ExpenseCategoryFormData = z.infer<typeof expenseCategoryFormSchema>

export const expenseFormSchema = z.object({
  title: z.string().min(1, 'Expense title is required').max(255, 'Title cannot exceed 255 characters'),
  amount: z.number().positive('Amount must be greater than zero'),
  categoryId: z.string().min(1, 'Please select an expense category'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional().or(z.literal('')),
  expenseDate: z.string().min(1, 'Expense date is required'),
  paymentMethod: z.enum(['STRIPE', 'CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']),
})

export type ExpenseFormData = z.infer<typeof expenseFormSchema>
