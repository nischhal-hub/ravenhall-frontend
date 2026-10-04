"use client"

import PageHeader from "@/components/ui/page-header"
import { ExpenseTable } from "@/components/expenses/expense-table"

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        size="lg"
        title="Expense Management"
        description="Track and manage business operating costs, facility maintenance, utilities, and vendor payments"
      />
      <ExpenseTable />
    </div>
  )
}
