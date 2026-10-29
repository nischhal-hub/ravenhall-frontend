"use client"

import { useState } from "react"
import { Loader2, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApplyDiscountCodeMutation } from "@/services/mutations/booking.mutations"

/**
 * Adds a promo code to an unpaid booking. The server re-checks the code,
 * re-prices the booking and updates the open Stripe checkout, so the amount
 * shown on the pay button refreshes after it succeeds.
 */
export function PromoCodeForm({ bookingId }: { bookingId: string }) {
  const [code, setCode] = useState("")
  const applyMutation = useApplyDiscountCodeMutation()

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    applyMutation.mutate(
      { id: bookingId, code: trimmed },
      { onSuccess: () => setCode("") }
    )
  }

  return (
    <form onSubmit={handleApply} className="space-y-1.5">
      <label
        htmlFor="promo-code"
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        <TicketPercent className="size-3.5" />
        Have a promo code?
      </label>
      <div className="flex gap-2">
        <Input
          id="promo-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          maxLength={50}
          autoComplete="off"
          className="font-mono uppercase"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!code.trim() || applyMutation.isPending}
        >
          {applyMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </form>
  )
}
