import { Suspense } from "react"
import PaymentSuccessClient from "./payment-success-client"

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d3b2e]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
          <p className="mt-4 text-lg text-emerald-200">
            Loading payment details...
          </p>
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  )
}
