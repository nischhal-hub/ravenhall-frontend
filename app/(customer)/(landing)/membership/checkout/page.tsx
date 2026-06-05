import { Suspense } from "react"
import MembershipCheckoutClient from "./membership-checkout-client"

export default function MembershipCheckoutPage() {
  return (
    <Suspense fallback={<p>Loading checkout...</p>}>
      <MembershipCheckoutClient />
    </Suspense>
  )
}
