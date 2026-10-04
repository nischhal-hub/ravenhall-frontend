"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  DollarSign,
  Receipt,
  Calendar as CalendarIcon,
  Tag,
  CreditCard,
  Banknote,
  Building2,
  HelpCircle,
  Upload,
  Check,
  Loader2,
  X,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/modal/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useExpenseCategoriesQuery } from "@/services/queries/expense.query"
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} from "@/services/mutations/expense.mutations"
import {
  expenseFormSchema,
  type ExpenseFormData,
} from "@/schemas/expense"
import type { Expense, ExpensePaymentMethod } from "@/types/expense-response.types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ExpenseFormDialogProps {
  open: boolean
  onClose: () => void
  expense?: Expense | null
  onOpenManageCategories?: () => void
}

const paymentOptions: Array<{
  value: ExpensePaymentMethod
  label: string
  icon: typeof DollarSign
}> = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "CARD", label: "Card / EFTPOS", icon: CreditCard },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2 },
  { value: "STRIPE", label: "Stripe", icon: DollarSign },
  { value: "OTHER", label: "Other", icon: HelpCircle },
]

export function ExpenseFormDialog({
  open,
  onClose,
  expense,
  onOpenManageCategories,
}: ExpenseFormDialogProps) {
  const isEditing = Boolean(expense)

  const { data: categoriesData, isLoading: isLoadingCategories } = useExpenseCategoriesQuery()
  const categories = categoriesData?.data || []

  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)

  const { mutate: createExpense, isPending: isCreating } = useCreateExpenseMutation()
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpenseMutation()

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema) as any,
    defaultValues: {
      title: "",
      amount: 0,
      categoryId: "",
      description: "",
      expenseDate: format(new Date(), "yyyy-MM-dd"),
      paymentMethod: "OTHER",
    },
  })

  // Synchronize form values when editing
  useEffect(() => {
    if (expense) {
      form.reset({
        title: expense.title,
        amount: expense.amount,
        categoryId: expense.categoryId,
        description: expense.description || "",
        expenseDate: format(new Date(expense.expenseDate), "yyyy-MM-dd"),
        paymentMethod: expense.paymentMethod || "OTHER",
      })
      setReceiptPreview(expense.receiptUrl)
      setReceiptFile(null)
    } else {
      form.reset({
        title: "",
        amount: "" as unknown as number,
        categoryId: categories[0]?.id || "",
        description: "",
        expenseDate: format(new Date(), "yyyy-MM-dd"),
        paymentMethod: "OTHER",
      })
      setReceiptPreview(null)
      setReceiptFile(null)
    }
  }, [expense, categories, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveReceipt = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
  }

  const onSubmit = (data: ExpenseFormData) => {
    if (receiptFile) {
      // Use FormData for file upload
      const formData = new FormData()
      formData.append("title", data.title.trim())
      formData.append("amount", data.amount.toString())
      formData.append("categoryId", data.categoryId)
      if (data.description) formData.append("description", data.description.trim())
      formData.append("expenseDate", data.expenseDate)
      formData.append("paymentMethod", data.paymentMethod)
      formData.append("receipt", receiptFile)

      if (isEditing && expense) {
        updateExpense(
          { id: expense.id, payload: formData },
          { onSuccess: () => onClose() }
        )
      } else {
        createExpense(formData, { onSuccess: () => onClose() })
      }
    } else {
      // Standard JSON payload
      const payload = {
        title: data.title.trim(),
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description?.trim() || undefined,
        expenseDate: data.expenseDate,
        paymentMethod: data.paymentMethod,
      }

      if (isEditing && expense) {
        updateExpense(
          { id: expense.id, payload },
          { onSuccess: () => onClose() }
        )
      } else {
        createExpense(payload, { onSuccess: () => onClose() })
      }
    }
  }

  const isPending = isCreating || isUpdating

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Receipt className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {isEditing ? "Edit Expense" : "Add Business Expense"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Record any operational, facility, utility, or staff expense
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="expense-title" className="text-xs">
                Expense Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expense-title"
                placeholder="e.g. Electricity Bill - October"
                {...form.register("title")}
                className="h-9 text-xs"
              />
              {form.formState.errors.title && (
                <p className="text-[10px] text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="expense-amount" className="text-xs">
                Amount ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...form.register("amount", { valueAsNumber: true })}
                className="h-9 font-mono text-xs"
              />
              {form.formState.errors.amount && (
                <p className="text-[10px] text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="expense-category" className="text-xs">
                  Category <span className="text-destructive">*</span>
                </Label>
                {onOpenManageCategories && (
                  <button
                    type="button"
                    onClick={onOpenManageCategories}
                    className="text-[11px] text-primary hover:underline"
                  >
                    + Manage Categories
                  </button>
                )}
              </div>
              <Select
                value={form.watch("categoryId")}
                onValueChange={(val) => form.setValue("categoryId", val)}
              >
                <SelectTrigger id="expense-category" className="h-9 text-xs">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="no-categories" disabled>
                      No categories found
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-[10px] text-destructive">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="expense-date" className="text-xs">
                Expense Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expense-date"
                type="date"
                {...form.register("expenseDate")}
                className="h-9 text-xs"
              />
              {form.formState.errors.expenseDate && (
                <p className="text-[10px] text-destructive">
                  {form.formState.errors.expenseDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Payment Method</Label>
            <RadioGroup
              value={form.watch("paymentMethod")}
              onValueChange={(val) =>
                form.setValue("paymentMethod", val as ExpensePaymentMethod)
              }
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {paymentOptions.map((opt) => {
                const Icon = opt.icon
                const isSelected = form.watch("paymentMethod") === opt.value
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`method-${opt.value}`}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                        : "border-border hover:bg-muted/40 text-foreground"
                    )}
                  >
                    <RadioGroupItem
                      value={opt.value}
                      id={`method-${opt.value}`}
                      className="sr-only"
                    />
                    <Icon className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </Label>
                )
              })}
            </RadioGroup>
          </div>

          {/* Description & Notes */}
          <div className="space-y-1">
            <Label htmlFor="expense-desc" className="text-xs">
              Description / Notes (optional)
            </Label>
            <Textarea
              id="expense-desc"
              rows={2}
              placeholder="Provide vendor details, invoice reference, or reason for expense..."
              {...form.register("description")}
              className="text-xs resize-none"
            />
          </div>

          {/* Receipt Attachment Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs">Receipt / Invoice Document (optional)</Label>

            {receiptPreview ? (
              <div className="relative rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                    {receiptPreview.startsWith("data:image") || receiptPreview.includes("res.cloudinary.com") ? (
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <FileText className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {receiptFile ? receiptFile.name : "Attached Receipt"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {receiptFile ? `${Math.round(receiptFile.size / 1024)} KB` : "Uploaded to cloud"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveReceipt}
                  className="size-7 text-muted-foreground hover:text-destructive"
                  title="Remove receipt"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="receipt-upload"
                className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <Upload className="size-5 text-muted-foreground mb-1" />
                <span className="text-xs font-medium text-foreground">
                  Click to upload invoice / receipt
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Supports PNG, JPG, WEBP, PDF up to 5MB
                </span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  {isEditing ? "Saving..." : "Recording..."}
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  {isEditing ? "Save Changes" : "Record Expense"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
