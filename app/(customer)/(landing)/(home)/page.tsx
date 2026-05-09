import { FeaturesSection } from "@/components/pages/landing/features-section"
import { HeroSection } from "@/components/pages/landing/hero-section"
import { HowItWorksSection } from "@/components/pages/landing/how-it-works-section"
import { LanesSection } from "@/components/pages/landing/lanes-section"
import { MembershipSection } from "@/components/pages/landing/membership-section"
import { QuickBookFab } from "@/components/pages/landing/quick-book-fab"

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
