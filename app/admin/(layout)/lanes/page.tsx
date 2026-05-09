"use client"

import ComingSoonPage from "@/components/ui/coming-soon-page"
import PageHeader from "@/components/ui/page-header"

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="Bookings" description="Preview all bookings" />
      <div className="flex flex-wrap gap-2"></div>
      <ComingSoonPage title={"Bookings"} />
    </div>
  )
}
