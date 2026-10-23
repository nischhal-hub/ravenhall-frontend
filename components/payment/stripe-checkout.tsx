"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { createPaymentIntentRequest } from "@/services/mutations/payment.mutations"
import { ApiError } from "@/types/response"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
if (!stripeKey) {
  console.error(
    "[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. " +
      "Make sure it's set in your .env and you've restarted the dev server."
  )
}
const stripePromise = loadStripe(stripeKey ?? "")

/** Where Stripe sends the customer after paying; the page checks the result */
export const paymentReturnUrl = (bookingId: string) =>
  `${window.location.origin}/payment/success?bookingId=${encodeURIComponent(bookingId)}`

function CheckoutForm({
  bookingId,
  amount,
  currency,
}: {
  bookingId: string
  amount: number
  currency: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) {
      toast.error("Payment form is still loading. Please wait a moment.")
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
        confirmParams: { return_url: paymentReturnUrl(bookingId) },
      })

      // Only reached if payment failed (Stripe redirects on success)
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
        <PaymentElement options={{ layout: "tabs" }} />
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
            Pay {formatCurrency(amount, currency)} Securely
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You won&apos;t be charged until you confirm
      </p>

      <div className="flex items-center justify-center gap-5 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-3.5 text-accent" /> SSL Secured
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-3.5 text-accent" /> Instant Confirmation
        </span>
      </div>
    </div>
  )
}

/**
 * Starts (or resumes) checkout for a PENDING booking and shows the Stripe card
 * form. The server reuses the booking's PaymentIntent, so opening this again
 * after leaving checkout never charges twice.
 */
export function StripeCheckout({ bookingId }: { bookingId: string }) {
  const intent = useQuery({
    queryKey: ["payment-intent", bookingId],
    queryFn: () => createPaymentIntentRequest({ bookingId }),
    enabled: !!bookingId,
    retry: false,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
  })

  if (intent.isPending) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12"
        role="status"
      >
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
    )
  }

  if (intent.isError || !intent.data?.clientSecret) {
    const error = intent.error
    const message =
      error instanceof ApiError && error.status && error.status < 500
        ? error.message
        : "We couldn't start the payment. Check your connection and try again."
    return (
      <div
        className="flex flex-col items-center gap-3 py-10 text-center"
        role="alert"
      >
        <AlertTriangle className="size-8 text-amber-600 dark:text-amber-400" />
        <p className="max-w-sm text-sm text-foreground">{message}</p>
        {!(error instanceof ApiError && error.status === 409) && (
          <Button
            variant="outline"
            onClick={() => intent.refetch()}
            disabled={intent.isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={intent.isFetching ? "size-4 animate-spin" : "size-4"}
            />
            Try again
          </Button>
        )}
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: intent.data.clientSecret,
        appearance: { theme: "stripe", variables: { colorPrimary: "#22c55e" } },
      }}
    >
      <CheckoutForm
        bookingId={bookingId}
        amount={intent.data.amount}
        currency={intent.data.currency}
      />
    </Elements>
  )
}
