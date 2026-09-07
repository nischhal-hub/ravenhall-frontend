"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Calendar, Award, ArrowRight } from "lucide-react"
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

export default function MembershipSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const plan = searchParams.get("plan") || "ANNUAL"
  const paymentIntent = searchParams.get("payment_intent")
  const redirectStatus = searchParams.get("redirect_status")

  const [isConfirming, setIsConfirming] = useState(true)

  const confirmMutation = useConfirmMembershipPayment()

  const confirmPayment = useCallback(async () => {
    if (!paymentIntent) return

    try {
      setIsConfirming(true)

      await confirmMutation.mutateAsync({
        paymentIntentId: paymentIntent,
      })

      toast.success("Membership activated successfully!")
    } catch (error: any) {
      console.error(error)
      toast.error(
        error?.response?.data?.message || "Failed to activate membership"
      )
    } finally {
      setIsConfirming(false)
    }
  }, [paymentIntent, confirmMutation])

  useEffect(() => {
    if (redirectStatus === "succeeded" && paymentIntent) {
      confirmPayment()
    } else {
      toast.error("Payment was not successful")
      router.push("/membership")
    }
  }, [redirectStatus, paymentIntent, confirmPayment, router])

  if (isConfirming) {
    return (
      <MembershipLoadingScreen
        message="Activating your membership..."
        description="Please wait a moment"
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
          Welcome to the {plan === "ANNUAL" ? "Annual" : "Monthly"} Membership
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
                {plan === "ANNUAL"
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
