"use client"

import ComingSoonPage from "@/components/ui/coming-soon-page"
import { PanelHero } from "@/components/panel/panel-hero"

export default function Page() {
  return (
    <div className="space-y-4">
      <PanelHero
        eyebrow="Account"
        title="Notifications"
        description="Stay on top of booking updates and offers"
      />
      <ComingSoonPage title="Notifications" />
    </div>
  )
}
