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
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
        className="h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"
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
          <ShieldCheck className="size-4 text-accent" /> SSL Secured
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-4 text-accent" /> Instant Confirmation
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
        const response = await createIntent.mutateAsync({ plan })

        // Handle different possible response shapes
        const secret =
          response?.clientSecret ||
          //@ts-ignore
          response?.data?.clientSecret ||
          //@ts-ignore
          response?.data?.client_secret ||
          //@ts-ignore
          response?.body?.clientSecret ||
          //@ts-ignore
          response?.body?.data?.clientSecret

        if (secret) {
          setClientSecret(secret)
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
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="size-12 animate-spin text-accent" />
          <p className="mt-4 text-sm text-muted-foreground">
            Preparing secure checkout...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <Card className="max-w-md p-8 text-center">
          <Alert variant="destructive">
            <AlertDescription className="text-destructive">
              <p className="font-medium">Payment Initialization Failed</p>
              <p className="mt-1">{error}</p>
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} className="mt-6">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg p-8 shadow-lg">
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
      </Card>
    </div>
  )
}
