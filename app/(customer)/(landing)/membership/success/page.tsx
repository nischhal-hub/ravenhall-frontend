import { Suspense } from "react"
import MembershipSuccessClient from "./membership-success-client"

export default function MembershipSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <h2 className="text-2xl font-semibold">Loading...</h2>
          </div>
        </div>
      }
    >
      <MembershipSuccessClient />
    </Suspense>
  )
}
