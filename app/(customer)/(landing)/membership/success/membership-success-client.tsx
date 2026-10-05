"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  CheckCircle2,
  Calendar,
  Award,
  ArrowRight,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useConfirmMembershipPayment } from "@/services/mutations/membership.mutations"

export function MembershipLoadingScreen({
  message = "Loading...",
  description,
}: {
  message?: string
  description?: string
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <h2 className="text-2xl font-semibold">{message}</h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export default function MembershipSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const plan = searchParams.get("plan") || "ANNUAL"
  const paymentIntent = searchParams.get("payment_intent")
  const redirectStatus = searchParams.get("redirect_status")

  const hasTriggeredRef = useRef(false)
  const { mutate, isSuccess, isError, error } = useConfirmMembershipPayment()

  useEffect(() => {
    if (!paymentIntent || redirectStatus !== "succeeded") {
      toast.error("Payment was not successful")
      router.push("/membership")
      return
    }

    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    mutate({
      paymentIntentId: paymentIntent,
    })
  }, [paymentIntent, redirectStatus, router, mutate])

  const handleRetry = () => {
    if (paymentIntent) {
      mutate({
        paymentIntentId: paymentIntent,
      })
    }
  }

  if (isError) {
    const err = error as ApiErrorResponse | null
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to activate membership"

    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/30 px-4 py-12">
        <Card className="w-full max-w-lg p-10 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/15">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>

          <h1 className="mb-3 text-3xl font-bold">Activation Issue</h1>

          <p className="mb-6 text-muted-foreground">{errorMessage}</p>

          <p className="mb-8 text-xs text-muted-foreground">
            If your card was charged, your payment is secure. You can retry activation or reach out to support with Payment ID:{" "}
            <span className="font-mono font-semibold">
              {paymentIntent?.slice(0, 16)}...
            </span>
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleRetry}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Activation
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/panel/membership")}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.push("/membership")}
            >
              Back to Memberships
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!isSuccess) {
    return (
      <MembershipLoadingScreen
        message="Activating your membership..."
        description="Please wait a moment while we verify your payment."
      />
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg p-10 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/15">
          <CheckCircle2 className="h-12 w-12 text-accent" />
        </div>

        <h1 className="mb-3 text-4xl font-bold">Payment Successful!</h1>

        <p className="mb-8 text-xl text-muted-foreground">
          Welcome to the{" "}
          {plan.toUpperCase() === "ANNUAL"
            ? "Annual"
            : plan.toUpperCase() === "MONTHLY"
              ? "Monthly"
              : plan}{" "}
          Membership
        </p>

        <div className="mb-8 rounded-2xl bg-muted/50 p-6 text-left">
          <div className="flex justify-between border-b py-3">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-semibold capitalize">
              {plan.toLowerCase()}
            </span>
          </div>

          <div className="flex justify-between border-b py-3">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-accent">Active</span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-muted-foreground">Payment ID</span>
            <span className="font-mono text-sm">
              {paymentIntent?.slice(0, 12)}...
            </span>
          </div>
        </div>

        <div className="mb-10 space-y-4">
          <div className="flex items-start gap-4 text-left">
            <Award className="mt-1 h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Premium Benefits Unlocked</p>
              <p className="text-sm text-muted-foreground">
                {plan.toUpperCase() === "ANNUAL"
                  ? "20% discount + VIP access + Free guest passes"
                  : "10% discount + Priority booking"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <Calendar className="mt-1 h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Membership Activated</p>
              <p className="text-sm text-muted-foreground">
                You can now enjoy exclusive rates and priority access
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={() => router.push("/panel/membership")}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button variant="outline" size="lg" onClick={() => router.push("/")}>
            Back to Homepage
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          A confirmation email has been sent to your registered email.
        </p>
      </Card>
    </div>
  )
}
