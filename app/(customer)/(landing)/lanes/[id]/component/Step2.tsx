"use client"

import { useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Edit2,
  Tag,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  CalendarDays,
  Layers,
} from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"
import { useCreateBookingMutation } from "@/services/mutations/booking.mutations"
import { toast } from "sonner"

const PROMO_CODES: Record<string, number> = {
  OPENING20: 12,
  CRICKET10: 10,
}

const EQUIPMENT_FEE = 10
const MEMBER_DISCOUNT = 0.15

interface Step2Props {
  lane: Lane
  date: string
  slot: Slot
  duration: 1 | 2 | 3
  // ✅ FIX: onNext now includes bookingId as the third argument
  onNext: (promo: string, discount: number, bookingId: string) => void
  onBack: () => void
}

export function Step2({
  lane,
  date,
  slot,
  duration,
  onNext,
  onBack,
}: Step2Props) {
  const [promoInput, setPromoInput] = useState("")
  const [appliedPromo, setAppliedPromo] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  const createBookingMutation = useCreateBookingMutation()

  const laneHire = lane.hourlyRate * duration
  const memberDiscount = laneHire * MEMBER_DISCOUNT
  const subtotal = laneHire - memberDiscount - promoDiscount
  const total = subtotal + EQUIPMENT_FEE

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoDiscount(PROMO_CODES[code])
      setPromoError("")
      setPromoSuccess(`Code "${code}" applied! You saved $${PROMO_CODES[code]}`)
    } else {
      setPromoError("Invalid promo code.")
      setPromoSuccess("")
      setAppliedPromo("")
      setPromoDiscount(0)
    }
  }

  const handleProceed = async () => {
    const payload = {
      laneId: lane.id,
      slotId: slot.id,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration,
      totalAmount: total,
      discountAmount: promoDiscount + memberDiscount,
      finalAmount: total,
      promoCode: appliedPromo || null,
    }

    try {
      // @ts-expect-error - adjust based on your actual API response shape
      const result = await createBookingMutation.mutateAsync(payload)

      // Handle different possible response shapes
      const bookingId =
        result?.id ||
        result?.bookingId ||
        result?.data?.id ||
        result?.data?.bookingId

      if (!bookingId) {
        console.error("Booking created but no ID returned:", result)
        toast.error("Booking created but ID missing. Please contact support.")
        return
      }

      // ✅ FIX: Pass bookingId as third argument to onNext
      onNext(appliedPromo, promoDiscount, bookingId)
    } catch (err) {
      console.error("Booking creation failed:", err)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* ── Left Column ── */}
      <div className="space-y-5 lg:col-span-3">
        {/* Header */}
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-emerald-500 uppercase">
            Current Step
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
                {slot.startTime} — {slot.endTime}
              </p>
            </div>
          </div>

          {/* Duration badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Clock className="size-3" />
            {duration} hour{duration > 1 ? "s" : ""} session
          </div>
        </div>

        {/* Offers & Promo Card */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-bold text-foreground">Offers & Rewards</h2>

          {/* Member discount banner */}
          <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Member Discount Applied — 15% off
              </p>
              <p className="text-xs text-muted-foreground">
                Includes $10 bowling machine included
              </p>
            </div>
          </div>

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
                disabled={createBookingMutation.isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={applyPromo}
                disabled={createBookingMutation.isPending}
                className="shrink-0"
              >
                Apply
              </Button>
            </div>

            {promoSuccess && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
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
          <div className="overflow-hidden rounded-2xl bg-foreground text-background shadow-xl">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <p className="text-xs font-semibold tracking-widest text-background/50 uppercase">
                Order Summary
              </p>
              <p className="mt-1 text-sm text-background/60">
                Review your total before paying
              </p>
            </div>

            {/* Line items */}
            <div className="space-y-3 px-6 pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-background/70">Lane Hire (Base)</span>
                <span className="font-semibold">${laneHire.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Member Discount (15%)</span>
                <span className="font-semibold">
                  -${memberDiscount.toFixed(2)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo ({appliedPromo})</span>
                  <span className="font-semibold">
                    -${promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-background/70">
                <span>Equipment Rental</span>
                <span className="font-semibold">
                  ${EQUIPMENT_FEE.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-white/10" />

            {/* Total */}
            <div className="px-6 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-background/80">
                  TOTAL TO PAY
                </span>
                <span className="text-3xl font-black tracking-tight">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="mt-0.5 text-right text-xs text-background/40">
                Includes GST
              </p>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleProceed}
                disabled={createBookingMutation.isPending}
                className="h-12 w-full rounded-xl bg-emerald-500 text-base font-bold hover:bg-emerald-600 disabled:opacity-60"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  "Proceed to Payment →"
                )}
              </Button>

              <button
                type="button"
                onClick={onBack}
                className="mt-3 w-full text-center text-xs text-background/40 transition hover:text-background/70"
              >
                ← Back to Select Slot
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-500" /> SSL Secured
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-500" /> Instant
              Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
