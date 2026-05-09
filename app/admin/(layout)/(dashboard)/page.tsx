"use client"

import { Button } from "@/components/ui/button"
import ComingSoonPage from "@/components/ui/coming-soon-page"
import { ModalTrigger } from "@/components/ui/modal-trigger"
import PageHeader from "@/components/ui/page-header"

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" description="Analytics for application" />
      <div className="flex flex-wrap gap-2">
        <ModalTrigger modalKey="WELCOME_USERS" modalType="modal">
          <Button>Open modal</Button>
        </ModalTrigger>
        <ModalTrigger modalKey="EXAMPLE_SHEET" modalType="sheet">
          <Button variant={"outline"}>Open Sheet</Button>
        </ModalTrigger>
      </div>
      <ComingSoonPage title={"Dashboard"} />
    </div>
  )
}
