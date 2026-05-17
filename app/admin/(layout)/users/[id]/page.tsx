"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Bell, Zap, Calendar, ArrowLeft } from "lucide-react"
import { useProfileQuery } from "@/services/queries/user.query"
import { useRouter } from "next/navigation"

function formatDate(dateString?: string) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatCurrency(amount?: number) {
  if (amount == null) return "Rs0"
  return `Rs${amount.toLocaleString()}`
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: response, isLoading, error } = useProfileQuery()

  const user = response?.data

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading profile...
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Failed to load profile
      </div>
    )
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    createdAt,
    membership,
    bookings = [],
    notifications = [],
  } = user

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {firstName} {lastName}
          </h1>
          <p className="text-muted-foreground">{email}</p>
        </div>

        {/* Personal Info & Membership */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Email Verified</span>
              </div>
            </CardContent>
          </Card>

          {/* Membership */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {membership?.plan || "CASUAL"} Membership
              </CardTitle>
              <CardDescription>
                {membership?.isActive ? "Active Plan" : "Inactive"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {membership ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Discount
                    </span>
                    <Badge variant="default">
                      {membership.discountPct}% OFF
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                    <p className="font-medium">
                      {formatDate(membership.endDate)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  You don&apos;t have an active membership yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                No bookings yet
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{booking.bookingRef}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                        <p className="font-semibold">
                          {formatCurrency(booking.finalAmount)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                No notifications yet
              </p>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 6).map((notif: any) => (
                  <div key={notif.id} className="rounded-lg border p-4">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{notif.subject}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notif.body}
                        </p>
                      </div>
                      <p className="text-xs whitespace-nowrap text-muted-foreground">
                        {formatDate(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
