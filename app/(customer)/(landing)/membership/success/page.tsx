import { Suspense } from "react"
import MembershipSuccessClient, {
  MembershipLoadingScreen,
} from "./membership-success-client"

export default function MembershipSuccessPage() {
  return (
    <Suspense fallback={<MembershipLoadingScreen />}>
      <MembershipSuccessClient />
    </Suspense>
  )
}
