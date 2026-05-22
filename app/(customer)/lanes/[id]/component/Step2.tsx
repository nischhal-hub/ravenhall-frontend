"use client"

import { useState } from "react"
import { StepIndicator } from "./StepIndicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Tag, CheckCircle2 } from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"

const PROMO_CODES: Record<string, number> = {
  OPENING20: 12,
  CRICKET10: 10,
}

const MEMBER_DISCOUNT = 0.15

interface Step2Props {
  lane: Lane
  date: string
  slot: Slot
  duration: 1 | 2 | 3
  onNext: (promo: string, discount: number) => void
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

  const laneHire = lane.hourlyRate * duration
  const memberDiscount = laneHire * MEMBER_DISCOUNT
  const total = laneHire - memberDiscount - promoDiscount

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoDiscount(PROMO_CODES[code])
      setPromoError("")
      setPromoSuccess(
        `Code "${code}" applied! You saved $${PROMO_CODES[code].toFixed(2)}`
      )
    } else {
      setPromoError("Invalid promo code.")
      setPromoSuccess("")
      setAppliedPromo("")
      setPromoDiscount(0)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Column */}
      <div className="space-y-5 lg:col-span-3">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-emerald-500 uppercase">
            Current Step
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Review Booking
          </h1>
        </div>

        <StepIndicator step={2} />

        {/* Booking Details */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Booking Details</h2>
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="size-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Facility
              </p>
              <p className="font-medium text-foreground">{lane.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Date
              </p>
              <p className="font-medium text-foreground">
                {new Date(date).toLocaleDateString("en-AU", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                Time
              </p>
              <p className="font-medium text-foreground">
                {slot.startTime} — {slot.endTime}
              </p>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-bold text-foreground">Offers & Rewards</h2>

          <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
            <Tag className="size-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Member Discount — 15% off
              </p>
              <p className="text-xs text-muted-foreground">
                Applied automatically for members
              </p>
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Promo Code
            </label>
            <div className="flex gap-2">
              <Input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="e.g. OPENING20"
                className="font-mono uppercase"
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
              />
              <Button onClick={applyPromo}>Apply</Button>
            </div>
            {promoSuccess && (
              <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="size-3" />
                {promoSuccess}
              </p>
            )}
            {promoError && (
              <p className="mt-2 text-xs text-destructive">{promoError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex justify-end">
          <StepIndicator step={2} />
        </div>

        <div className="rounded-2xl bg-foreground p-6 text-background">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-background/70">Lane Hire</span>
              <span>${laneHire.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Member Discount (15%)</span>
              <span>-${memberDiscount.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo ({appliedPromo})</span>
                <span>-${promoDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={() => onNext(appliedPromo, promoDiscount)}
            className="mt-6 h-11 w-full rounded-xl bg-emerald-500 font-semibold hover:bg-emerald-600"
          >
            Proceed to Payment →
          </Button>
        </div>
      </div>
    </div>
  )
}
