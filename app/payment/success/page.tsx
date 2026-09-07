import { Suspense } from "react"
import PaymentSuccessClient, {
  PaymentLoadingScreen,
} from "./payment-success-client"

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentLoadingScreen />}>
      <PaymentSuccessClient />
    </Suspense>
  )
}
