"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, ShieldCheck, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useCreateMembershipPaymentIntent } from "@/services/mutations/membership.mutations"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
)

interface MembershipCheckoutProps {
  plan: string
  planName: string
  price: number
}

function CheckoutForm({ plan }: { plan: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) return

    setLoading(true)
    const { error: submitError } = await elements.submit()
    if (submitError) {
      toast.error(submitError.message || "Invalid card details")
      setLoading(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/membership/success?plan=${plan}`,
      },
    })

    if (error) toast.error(error.message || "Payment failed")
    setLoading(false)
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
        onClick={handlePay}
        disabled={!stripe || !elements || loading}
        className="h-12 w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 size-4" />
            Pay Securely
          </>
        )}
      </Button>

      <div className="flex justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-4" /> SSL Encrypted
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-4" /> Stripe Secured
        </span>
      </div>
    </div>
  )
}

export default function MembershipCheckout({
  plan,
  planName,
  price,
}: MembershipCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const createIntent = useCreateMembershipPaymentIntent()

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("🔄 Creating payment intent for:", plan)

        const response = await createIntent.mutateAsync({ plan })

        console.log("📦 Full Response from backend:", response)

        // Handle different possible response shapes
        const secret = response?.clientSecret
        // response?.data?.clientSecret ||
        // response?.data?.client_secret

        if (secret) {
          setClientSecret(secret)
          console.log("✅ ClientSecret received")
        } else {
          console.error("❌ No clientSecret in response:", response)
          setError("Invalid response from server (no clientSecret)")
        }
      } catch (err: any) {
        console.error("❌ Error creating intent:", err)
        const msg =
          err?.response?.data?.message || err.message || "Unknown error"
        setError(msg)
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [plan])

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Preparing secure checkout...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-600">
          Payment Initialization Failed
        </p>
        <p className="mt-2 text-sm text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-10 max-w-lg">
      <div className="rounded-2xl border bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">Complete Your Membership</h1>
        <p className="mb-6 text-muted-foreground">
          {planName} — ${price}
        </p>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret!,
            appearance: { theme: "stripe" },
          }}
        >
          <CheckoutForm plan={plan} />
        </Elements>
      </div>
    </div>
  )
}
