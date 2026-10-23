"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/reusable/empty-state"
import {
  DetailLayout,
  DetailPageHeader,
  InfoList,
  InfoRow,
} from "@/components/detail"

// The API has no "get one user" endpoint for admins yet. This page used to
// call /auth/me and so showed the signed-in admin's own profile for every id.
// Until that endpoint exists, say so plainly instead of showing the wrong person.
export default function UserDetailPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <DetailLayout className="pb-8">
      <DetailPageHeader
        backHref="/admin/users"
        backLabel="Users"
        title="User details"
      />

      <Card className="mx-auto max-w-lg px-6">
        <EmptyState
          icon={UserX}
          title="User details aren't available yet"
          description="A single user's profile can't be loaded on this page yet. Their name, email, role and join date are shown on the Users list."
          action={
            <div className="space-y-5">
              <div className="rounded-md bg-muted/50 p-3 text-left">
                <InfoList columns={1}>
                  <InfoRow label="User ID" value={id} copyValue={id} mono />
                </InfoList>
              </div>
              <Button asChild className="h-11 w-full text-sm md:h-9">
                <Link href="/admin/users">
                  <ArrowLeft />
                  Back to users
                </Link>
              </Button>
            </div>
          }
        />
      </Card>
    </DetailLayout>
  )
}
