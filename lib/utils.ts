import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number | null | undefined,
  currency = "AUD"
) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount ?? 0)
}

export function formatDate(iso: string) {
  return format(new Date(iso), "dd MMM yyyy")
}

export function formatDateTime(iso: string) {
  return format(new Date(iso), "dd MMM yyyy, HH:mm")
}
