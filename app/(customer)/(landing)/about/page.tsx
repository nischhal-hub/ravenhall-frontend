import { AboutContact } from "@/components/about/contact"
import { AboutHero } from "@/components/about/hero"
import { AboutLanes } from "@/components/about/lane"
import { AboutMission } from "@/components/about/mission"
import { AboutHowItWorks } from "@/components/about/work"

function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      <AboutHero />
      <AboutMission />
      <AboutLanes />
      <AboutHowItWorks />
      <AboutContact />
    </main>
  )
}

export default AboutPage
