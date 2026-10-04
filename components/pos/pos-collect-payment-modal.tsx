"use client"

import { useState } from "react"
import { DollarSign, CreditCard, Banknote, Building2, HelpCircle, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/modal/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCompletePosPaymentMutation } from "@/services/mutations/pos.mutations"
import type { PosBookingListItem, PosPaymentMethod } from "@/types/pos-response.types"
import { cn } from "@/lib/utils"

interface PosCollectPaymentModalProps {
  open: boolean
  onClose: () => void
  booking: PosBookingListItem | null
  onPaymentSuccess?: (bookingId: string) => void
}

const paymentOptions: Array<{
  value: PosPaymentMethod
  label: string
  icon: typeof DollarSign
}> = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "CARD", label: "Card / EFTPOS", icon: CreditCard },
  { value: "STRIPE", label: "Stripe", icon: DollarSign },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2 },
  { value: "OTHER", label: "Other", icon: HelpCircle },
]

export function PosCollectPaymentModal({
  open,
  onClose,
  booking,
  onPaymentSuccess,
}: PosCollectPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>("CASH")
  const [amount, setAmount] = useState<number>(booking?.finalAmount || 0)
  const [tendered, setTendered] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const { mutate: completePayment, isPending } = useCompletePosPaymentMutation()

  // Reset when booking changes
  const targetAmount = booking?.finalAmount ?? 0
  const tenderedNum = parseFloat(tendered) || 0
  const changeDue = Math.max(0, tenderedNum - targetAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking) return

    completePayment(
      {
        bookingId: booking.id,
        data: {
          paymentMethod,
          amount: amount > 0 ? amount : booking.finalAmount,
          notes: notes.trim() || undefined,
        },
      },
      {
        onSuccess: (updated) => {
          onClose()
          if (onPaymentSuccess) {
            onPaymentSuccess(updated.id)
          }
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <DollarSign className="size-5 text-accent" />
            Collect Payment
          </DialogTitle>
          {booking && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Booking Ref: <strong className="text-foreground">{booking.bookingRef}</strong></span>
              <span>Customer: <strong className="text-foreground">{booking.user.firstName} {booking.user.lastName}</strong></span>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Amount Due Display */}
          <div className="rounded-lg bg-muted/50 p-4 text-center border border-border">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Amount Outstanding</span>
            <div className="text-3xl font-heading font-black text-primary mt-0.5">
              ${(booking?.finalAmount || 0).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">AUD</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Select Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val as PosPaymentMethod)}
              className="grid grid-cols-2 gap-2"
            >
              {paymentOptions.map((opt) => {
                const Icon = opt.icon
                const isSelected = paymentMethod === opt.value
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`collect-method-${opt.value}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border p-3 cursor-pointer text-xs transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary"
                        : "border-border hover:bg-muted/40 text-foreground"
                    )}
                  >
                    <RadioGroupItem value={opt.value} id={`collect-method-${opt.value}`} className="sr-only" />
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span>{opt.label}</span>
                  </Label>
                )
              })}
            </RadioGroup>
          </div>

          {/* Cash Tendered & Change Due Helper */}
          {paymentMethod === "CASH" && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-dashed border-border bg-card">
              <div className="space-y-1">
                <Label htmlFor="tendered-amount" className="text-xs">Cash Received ($)</Label>
                <Input
                  id="tendered-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                  className="h-9 font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Change Due ($)</Label>
                <div className={cn(
                  "h-9 px-3 flex items-center rounded-md font-mono text-sm font-bold border",
                  tenderedNum >= targetAmount && targetAmount > 0
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-muted text-muted-foreground border-border"
                )}>
                  ${changeDue.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Optional Amount Override */}
          <div className="space-y-1">
            <Label htmlFor="override-amount" className="text-xs">
              Amount Paid ($) <span className="text-[10px] text-muted-foreground">(defaults to total)</span>
            </Label>
            <Input
              id="override-amount"
              type="number"
              step="0.01"
              min="0"
              defaultValue={booking?.finalAmount || 0}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="h-9 font-mono"
            />
          </div>

          {/* Payment Notes */}
          <div className="space-y-1">
            <Label htmlFor="payment-notes" className="text-xs">Staff Note (optional)</Label>
            <Textarea
              id="payment-notes"
              rows={2}
              placeholder="e.g. Paid cash at counter after practice"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Confirm Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
