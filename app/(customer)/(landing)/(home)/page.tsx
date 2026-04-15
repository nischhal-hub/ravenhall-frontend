import { FeaturesSection } from "@/components/landing/features-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LanesSection } from "@/components/landing/lanes-section"
import { MembershipSection } from "@/components/landing/membership-section"
import { QuickBookFab } from "@/components/landing/quick-book-fab"

export default function CustomerLandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <LanesSection />
      <HowItWorksSection />
      <MembershipSection />
      <QuickBookFab />
    </main>
  )
}
