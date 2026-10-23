"use client"

import { StepIndicator } from "./StepIndicator"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"
import { calculateBookingPrice } from "@/lib/booking"
import { StripeCheckout } from "@/components/payment/stripe-checkout"

interface Step3Props {
  lane: Lane
  date: string
  slot: Slot
  duration: 1 | 2 | 3
  /** End of the whole session (start + duration) */
  endTime: string
  memberDiscountPct: number
  promo: string
  promoDiscount: number
  /** Created in Step 2 */
  bookingId: string
  onBack: () => void
}

// ─────────────────────────────────────────────
// Step 3 — Payment (booking already created in Step 2)
// ─────────────────────────────────────────────
export function Step3({
  lane,
  date,
  slot,
  duration,
  endTime,
  memberDiscountPct,
  promo,
  promoDiscount,
  bookingId,
  onBack,
}: Step3Props) {
  const price = calculateBookingPrice({
    hourlyRate: lane.hourlyRate,
    duration,
    memberDiscountPct,
    promoDiscount,
  })
  const total = price.total

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* ── Left: Payment Form ── */}
      <div className="space-y-5 lg:col-span-3">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Step 3 of 3
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Payment Details
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your booking securely with Stripe
          </p>
        </div>

        <StepIndicator step={3} />

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {bookingId ? (
            <StripeCheckout bookingId={bookingId} />
          ) : (
            <p
              className="py-10 text-center text-sm text-muted-foreground"
              role="alert"
            >
              We couldn&apos;t find this booking. Go back and try again.
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Booking Summary ── */}
      <div className="lg:col-span-2">
        <div className="sticky top-6 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Booking Summary
              </p>
            </div>

            {/* Booking meta */}
            <div className="space-y-2 px-6 pb-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{lane.name}</p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 shrink-0" />
                <span>
                  {new Date(date).toLocaleDateString("en-AU", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0" />
                <span>
                  {slot.startTime} — {endTime} &nbsp;·&nbsp;{duration} hr
                  {duration > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mx-6 border-t border-border" />

            {/* Line items */}
            <div className="space-y-3 px-6 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Lane Hire ({duration} Hr)
                </span>
                <span className="font-semibold text-foreground">
                  ${price.laneHire.toFixed(2)}
                </span>
              </div>
              {memberDiscountPct > 0 && (
                <div className="flex justify-between text-primary dark:text-rose-400">
                  <span>Member Discount ({memberDiscountPct}%)</span>
                  <span className="font-semibold">
                    -${price.memberDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              {price.promoDiscount > 0 && (
                <div className="flex justify-between text-primary dark:text-rose-400">
                  <span>Promo ({promo})</span>
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

            <div className="mx-6 border-t border-border" />

            {/* Total */}
            <div className="px-6 py-5">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  TOTAL AMOUNT
                </span>
                <span className="text-3xl font-black tracking-tight text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="mt-0.5 text-right text-xs text-muted-foreground">
                Includes GST
              </p>
            </div>

            {/* Cancellation note */}
            <div className="mx-6 mb-5 rounded-xl bg-muted px-4 py-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                Free cancellation
              </span>{" "}
              any time before your session starts. Card payments are refunded
              automatically.
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Review
          </button>
        </div>
      </div>
    </div>
  )
}
