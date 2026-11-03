"use client"

import { useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Edit2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  CalendarDays,
  Layers,
} from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"
import {
  type CheckoutResult,
  useStartCheckoutMutation,
} from "@/services/mutations/payment.mutations"
import { validateDiscountCodeRequest } from "@/services/mutations/discount.mutations"
import { calculateBookingPrice } from "@/lib/booking"

interface Step2Props {
  lane: Lane
  date: string
  slot: Slot
  duration: 1 | 2 | 3
  /** End of the whole session (start + duration) */
  endTime: string
  memberDiscountPct: number
  isMemberLoading: boolean
  /** Checkout has started; nothing is booked until it's paid */
  onNext: (checkout: CheckoutResult) => void
  onBack: () => void
}

export function Step2({
  lane,
  date,
  slot,
  duration,
  endTime,
  memberDiscountPct,
  isMemberLoading,
  onNext,
  onBack,
}: Step2Props) {
  const [promoInput, setPromoInput] = useState("")
  const [appliedPromo, setAppliedPromo] = useState("")
  const [promoPct, setPromoPct] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)

  const startCheckoutMutation = useStartCheckoutMutation()
  const isBusy = startCheckoutMutation.isPending || isCheckingPromo

  // Same rule as the server: a code replaces the member discount (it's only
  // applied when it's worth more), and only lane hire is discounted
  const price = calculateBookingPrice({
    hourlyRate: lane.hourlyRate,
    duration,
    memberDiscountPct: appliedPromo ? 0 : memberDiscountPct,
    promoDiscount: (lane.hourlyRate * duration * promoPct) / 100,
  })

  const clearPromo = () => {
    setAppliedPromo("")
    setPromoPct(0)
  }

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    setPromoError("")
    setPromoSuccess("")
    setIsCheckingPromo(true)
    try {
      const result = await validateDiscountCodeRequest({
        code,
        amount: price.gross,
      })
      if (!result.valid) {
        clearPromo()
        setPromoError(result.message)
      } else if (result.discountPct <= memberDiscountPct) {
        clearPromo()
        setPromoError(
          `Your ${memberDiscountPct}% member discount is already better than this code.`
        )
      } else {
        setAppliedPromo(code)
        setPromoPct(result.discountPct)
        setPromoSuccess(
          `Code "${code}" applied: ${result.discountPct}% off lane hire`
        )
      }
    } catch (err) {
      clearPromo()
      setPromoError(
        err instanceof Error ? err.message : "We couldn't check this code."
      )
    } finally {
      setIsCheckingPromo(false)
    }
  }

  // Opens the payment only; the booking is created once it's paid
  const handleProceed = async () => {
    try {
      const checkout = await startCheckoutMutation.mutateAsync({
        slotId: slot.id,
        duration,
        ...(appliedPromo && { discountCode: appliedPromo }),
      })
      onNext(checkout)
    } catch (err) {
      // The mutation already shows the server's message
      console.error("Couldn't start checkout:", err)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* ── Left Column ── */}
      <div className="space-y-5 lg:col-span-3">
        {/* Header */}
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Step 2 of 3
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Review Booking
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review your details and apply any discounts before proceeding
          </p>
        </div>

        <StepIndicator step={2} />

        {/* Booking Details Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Booking Details</h2>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
            >
              <Edit2 className="size-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                <Layers className="size-3" /> Facility
              </span>
              <p className="font-semibold text-foreground">{lane.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                <CalendarDays className="size-3" /> Date
              </span>
              <p className="font-semibold text-foreground">
                {new Date(date).toLocaleDateString("en-AU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                <Clock className="size-3" /> Time
              </span>
              <p className="font-semibold text-foreground">
                {slot.startTime} — {endTime}
              </p>
            </div>
          </div>

          {/* Duration badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-primary dark:text-rose-400">
            <Clock className="size-3" />
            {duration} hour{duration > 1 ? "s" : ""} session
          </div>
        </div>

        {/* Offers & Promo Card */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-bold text-foreground">Offers & Rewards</h2>

          {/* Member discount banner */}
          {memberDiscountPct > 0 && !appliedPromo && (
            <div className="flex gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <ShieldCheck className="size-4 text-primary dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary dark:text-rose-400">
                  Member Discount Applied — {memberDiscountPct}% off
                </p>
                <p className="text-xs text-muted-foreground">
                  Applies to lane hire. Equipment fee is not discounted.
                </p>
              </div>
            </div>
          )}

          {/* Promo Code */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Promo or Voucher Code
            </label>
            <div className="flex gap-2">
              <Input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="e.g. OPENING20"
                className="font-mono uppercase"
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                disabled={isBusy}
              />
              <Button
                type="button"
                variant="outline"
                onClick={applyPromo}
                disabled={isBusy || !promoInput.trim()}
                className="shrink-0"
              >
                {isCheckingPromo ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>

            {promoSuccess && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary dark:text-rose-400">
                <CheckCircle2 className="size-3.5" />
                {promoSuccess}
              </p>
            )}
            {promoError && (
              <p className="mt-2 text-xs text-destructive">{promoError}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Column — Order Summary ── */}
      <div className="lg:col-span-2">
        <div className="sticky top-6 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Order Summary
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your total before paying
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-3 px-6 pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Lane Hire ({duration} Hr)
                </span>
                <span className="font-semibold text-foreground">
                  ${price.laneHire.toFixed(2)}
                </span>
              </div>
              {price.memberDiscount > 0 && (
                <div className="flex justify-between text-primary dark:text-rose-400">
                  <span>Member Discount ({memberDiscountPct}%)</span>
                  <span className="font-semibold">
                    -${price.memberDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              {price.promoDiscount > 0 && (
                <div className="flex justify-between text-primary dark:text-rose-400">
                  <span>Promo ({appliedPromo})</span>
                  <span className="font-semibold">
                    -${price.promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Equipment Fee</span>
                <span className="font-semibold text-foreground">
                  ${price.equipmentFee.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-border" />

            {/* Total */}
            <div className="px-6 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  TOTAL TO PAY
                </span>
                <span className="text-3xl font-black tracking-tight text-foreground">
                  ${price.total.toFixed(2)}
                </span>
              </div>
              <p className="mt-0.5 text-right text-xs text-muted-foreground">
                Includes GST
              </p>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleProceed}
                disabled={isBusy || isMemberLoading}
                className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {startCheckoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Preparing Payment...
                  </>
                ) : (
                  "Proceed to Payment →"
                )}
              </Button>

              <button
                type="button"
                onClick={onBack}
                className="mt-3 w-full text-center text-xs text-muted-foreground transition hover:text-foreground"
              >
                ← Back to Select Slot
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-primary dark:text-rose-400" /> SSL Secured
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-primary dark:text-rose-400" /> Instant
              Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
