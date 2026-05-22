"use client"
import { useState, useEffect } from "react"
import { StepIndicator } from "./StepIndicator"
import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft, Loader2 } from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"
import { useCreateBookingMutation } from "@/services/mutations/booking.mutations"
import { useCreatePaymentIntentMutation } from "@/services/mutations/payment.mutations"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { toast } from "sonner"

// ✅ FIX 1: Guard against missing env var and log it clearly
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
  onBack: () => void
  onComplete: () => void
}

// ─────────────────────────────────────────────
// Checkout Form
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

  // ✅ FIX 2: Use onClick on a plain button instead of <form onSubmit>
  //    This avoids native form-submission interference with Stripe's redirect.
  const handlePay = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please wait a moment.")
      return
    }

    setLoading(true)

    // ✅ FIX 3: Call elements.submit() first — required by newer Stripe.js versions
    //    before calling stripe.confirmPayment() when NOT using a <form>.
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
          // ✅ FIX 4: Stripe will redirect to this URL after payment succeeds.
          //    Make sure your /payment/success page exists and handles ?bookingId=
          return_url: `${window.location.origin}/payment/success?bookingId=${bookingId}`,
        },
        // ✅ FIX 5: Do NOT pass redirect: "if_required" unless you want to handle
        //    the success case manually. For a full redirect flow, omit it entirely
        //    (defaults to "always"), which makes Stripe navigate the browser.
      })

      // ✅ NOTE: If we reach this point, the payment FAILED (Stripe would have
      //    redirected the browser on success and this code would never run).
      if (error) {
        // These are card errors, validation errors, etc.
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
    // ✅ FIX 6: Use a plain <div> instead of <form> to avoid any form-submit
    //    race conditions. The button is type="button" to be 100% safe.
    <div className="space-y-6">
      <PaymentElement />
      <Button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || loading}
        className="h-12 w-full bg-emerald-500 text-base font-bold hover:bg-emerald-600"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="mr-2 size-4" />
            Pay ₹{total.toFixed(2)} Now
          </>
        )}
      </Button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Step 3 — Main Component
// ─────────────────────────────────────────────
export function Step3({
  lane,
  date,
  slot,
  duration,
  promo,
  promoDiscount,
  onBack,
}: Step3Props) {
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const createBookingMutation = useCreateBookingMutation()
  const createPaymentIntentMutation = useCreatePaymentIntentMutation()

  // ── Price calculations ──────────────────────
  const laneHire = lane.hourlyRate * duration
  const memberDisc = laneHire * MEMBER_DISCOUNT
  const subtotal = laneHire - memberDisc - promoDiscount
  const total = subtotal + EQUIPMENT_FEE

  // ── Step A: Create Booking ──────────────────
  const handleCreateBooking = async () => {
    const payload = {
      laneId: lane.id,
      slotId: slot.id,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration,
      totalAmount: total,
      discountAmount: promoDiscount + memberDisc,
      finalAmount: total,
      promoCode: promo || null,
    }

    try {
      const result = await createBookingMutation.mutateAsync(payload)
      setBookingId(result.id)
      toast.success("Booking created! Preparing payment...")
    } catch (error) {
      console.error("[Booking] Failed to create booking:", error)
      toast.error("Failed to create booking. Please try again.")
    }
  }

  // ── Step B: Create Payment Intent ──────────
  const initializePayment = async (id: string) => {
    setIsInitializing(true)
    try {
      const response = await createPaymentIntentMutation.mutateAsync({
        bookingId: id,
      })

      // ✅ FIX 7: Log the raw response so you can immediately spot if the
      //    clientSecret is nested (e.g. response.data.clientSecret vs response.clientSecret).
      //    Remove this log once confirmed working.
      console.log("[Payment] Raw payment intent response:", response)

      // ✅ FIX 8: Handle both shapes defensively.
      //    If your apiClient (axios) already unwraps response.data, then
      //    `response.clientSecret` is correct. If sendSuccess wraps it in
      //    { data: { clientSecret } }, use `response.data?.clientSecret`.
      const secret =
        (response as any).clientSecret ??
        (response as any).data?.clientSecret ??
        null

      if (!secret) {
        console.error(
          "[Payment] clientSecret not found in response. Full response:",
          response
        )
        toast.error(
          "Could not initialize payment (missing clientSecret). Check console."
        )
        return
      }

      setClientSecret(secret)
    } catch (error) {
      console.error("[Payment] Failed to create payment intent:", error)
      toast.error("Failed to initialize payment. Please try again.")
    } finally {
      setIsInitializing(false)
    }
  }

  // ✅ FIX 9: Pass the id directly instead of reading from state (avoids
  //    stale-closure issues where bookingId is still null inside the effect).
  useEffect(() => {
    if (bookingId) {
      initializePayment(bookingId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId])

  // ── Stripe Elements appearance ──────────────
  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
          variables: {
            colorPrimary: "#10b981", // emerald-500
          },
        },
      }
    : undefined

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* ── Left: Payment Section ── */}
      <div className="space-y-5 lg:col-span-3">
        <StepIndicator step={3} />

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Secure Payment
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your booking securely with Stripe
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          {!bookingId ? (
            // ── Step A: Confirm & create booking ──
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Review your booking above, then click below to proceed to
                payment.
              </p>
              <Button
                type="button"
                onClick={handleCreateBooking}
                disabled={createBookingMutation.isPending}
                className="h-12 w-full"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          ) : !clientSecret || isInitializing ? (
            // ── Step B: Loading payment intent ──
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="size-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-sm text-muted-foreground">
                Preparing secure payment...
              </p>
            </div>
          ) : (
            // ── Step C: Stripe payment form ──
            // ✅ FIX 10: Pass the full `elementsOptions` object (not just clientSecret)
            //    so appearance config is applied and Stripe initialises correctly.
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm bookingId={bookingId} total={total} />
            </Elements>
          )}
        </div>
      </div>

      {/* ── Right: Summary Panel ── */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-foreground p-6 text-background">
          <h2 className="text-lg font-bold">Final Summary</h2>

          <div className="mt-4 space-y-1 text-sm text-background/60">
            <p>{lane.name}</p>
            <p>
              {date} · {slot.startTime} – {slot.endTime}
            </p>
            <p>
              {duration} hour{duration > 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-background/70">Lane Hire</span>
              <span>₹{laneHire.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Member Discount (15%)</span>
              <span>-₹{memberDisc.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo ({promo})</span>
                <span>-₹{promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-background/70">
              <span>Equipment Fee</span>
              <span>₹{EQUIPMENT_FEE.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-end justify-between">
              <span className="text-base font-bold">Total Amount</span>
              <span className="text-3xl font-black">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Review
        </button>
      </div>
    </div>
  )
}
