"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Calendar, Award, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useConfirmMembershipPayment } from "@/services/mutations/membership.mutations"
import { useMyMembershipQuery } from "@/services/queries/membership.query"

export default function MembershipSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const plan = searchParams.get("plan") || "ANNUAL"
  const paymentIntent = searchParams.get("payment_intent")
  const redirectStatus = searchParams.get("redirect_status")

  const [isConfirming, setIsConfirming] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  const confirmMutation = useConfirmMembershipPayment()
  const { data: membership } = useMyMembershipQuery()
  console.log("Current membership data:", membership)

  useEffect(() => {
    if (redirectStatus === "succeeded" && paymentIntent) {
      confirmPayment()
    } else {
      toast.error("Payment was not successful")
      router.push("/membership")
    }
  }, [])

  const confirmPayment = async () => {
    try {
      setIsConfirming(true)
      await confirmMutation.mutateAsync({
        paymentIntentId: paymentIntent!,
      })

      setIsSuccess(true)
      toast.success("Membership activated successfully!")
    } catch (error: any) {
      console.error(error)
      toast.error(
        error?.response?.data?.message || "Failed to activate membership"
      )
    } finally {
      setIsConfirming(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <h2 className="text-2xl font-semibold">
            Activating your membership...
          </h2>
          <p className="mt-2 text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg p-10 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
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
            <span className="font-semibold text-emerald-600">Active</span>
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
            onClick={() => router.push("/dashboard")}
            className="w-full"
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
