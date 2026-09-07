"use client"

import { useState, useEffect } from "react"
import { StepIndicator } from "./StepIndicator"
import { Button } from "@/components/ui/button"
import {
  Lock,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  Clock,
} from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"
import { useCreatePaymentIntentMutation } from "@/services/mutations/payment.mutations"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { toast } from "sonner"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
if (!stripeKey) {
  console.error(
    "[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. " +
      "Make sure it's set in your .env.local and you've restarted the dev server."
  )
}
const stripePromise = loadStripe(stripeKey ?? "")

const EQUIPMENT_FEE = 10
const MEMBER_DISCOUNT = 0.15

interface Step3Props {
  lane: Lane
  date: string
  slot: Slot
  duration: 1 | 2 | 3
  promo: string
  promoDiscount: number
  /** ✅ FIX: bookingId created in Step2 must be passed in */
  bookingId: string
  onBack: () => void
}

// ─────────────────────────────────────────────
// Inner Checkout Form (rendered inside <Elements>)
// ─────────────────────────────────────────────
function CheckoutForm({
  bookingId,
  total,
}: {
  bookingId: string
  total: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please wait a moment.")
      return
    }

    setLoading(true)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      toast.error(submitError.message || "Please check your card details.")
      setLoading(false)
      return
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?bookingId=${bookingId}`,
        },
      })

      // Only reached if payment FAILED (Stripe redirects on success)
      if (error) {
        toast.error(error.message || "Payment failed. Please try again.")
      }
    } catch (err) {
      console.error("[Stripe] Unexpected error during confirmPayment:", err)
      toast.error("Something went wrong during payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Card Details
        </label>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <Button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || loading}
        className="h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="mr-2 size-4" />
            Pay ${total.toFixed(2)} Securely
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You won&apos;t be charged until you confirm
      </p>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-5 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-accent" /> SSL Secured
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-3.5 text-accent" /> Instant
          Confirmation
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Step 3 — Payment (booking already created in Step 2)
// ─────────────────────────────────────────────
export function Step3({
  lane,
  date,
  slot,
  duration,
  promo,
  promoDiscount,
  bookingId,
  onBack,
}: Step3Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const createPaymentIntentMutation = useCreatePaymentIntentMutation()

  const laneHire = lane.hourlyRate * duration
  const memberDisc = laneHire * MEMBER_DISCOUNT
  const subtotal = laneHire - memberDisc - promoDiscount
  const total = subtotal + EQUIPMENT_FEE

  // ✅ FIX: bookingId is now correctly passed from BookingPage via props
  useEffect(() => {
    if (!bookingId) {
      console.error(
        "[Step3] bookingId is missing — cannot create payment intent"
      )
      toast.error("Booking ID missing. Please go back and try again.")
      setIsInitializing(false)
      return
    }

    const initializePayment = async () => {
      setIsInitializing(true)
      try {
        const response = await createPaymentIntentMutation.mutateAsync({
          bookingId,
        })

        const secret =
          (response as any).clientSecret ??
          (response as any).data?.clientSecret ??
          null

        if (!secret) {
          console.error(
            "[Payment] clientSecret not found in response:",
            response
          )
          toast.error(
            "Could not initialise payment (missing clientSecret). Check console."
          )
          return
        }

        setClientSecret(secret)
      } catch (error) {
        console.error("[Payment] Failed to create payment intent:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializePayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
          variables: { colorPrimary: "#22c55e" },
        },
      }
    : undefined

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
          {isInitializing || !clientSecret ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="size-14 rounded-full border-4 border-accent/15" />
                <Loader2 className="absolute inset-0 m-auto size-8 animate-spin text-accent" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">
                Preparing secure payment...
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Setting up your Stripe payment session
              </p>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm bookingId={bookingId} total={total} />
            </Elements>
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
                  {slot.startTime} — {slot.endTime} &nbsp;·&nbsp;{duration} hr
                  {duration > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mx-6 border-t border-border" />

            {/* Line items */}
            <div className="space-y-3 px-6 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lane Hire</span>
                <span className="font-semibold text-foreground">
                  ${laneHire.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-accent">
                <span>Member Discount (15%)</span>
                <span className="font-semibold">-${memberDisc.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Promo ({promo})</span>
                  <span className="font-semibold">
                    -${promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Equipment Fee</span>
                <span className="font-semibold text-foreground">
                  ${EQUIPMENT_FEE.toFixed(2)}
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
              up to 24 hours before your session starts.
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
