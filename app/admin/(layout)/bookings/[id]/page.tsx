"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookingById } from "@/services/queries/bookings.query"

const statusColors = {
  CONFIRMED: "bg-emerald-500 text-white",
  PENDING: "bg-amber-500 text-white",
  CANCELLED: "bg-red-500 text-white",
  COMPLETED: "bg-blue-500 text-white",
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useBookingById(id)
  console.log(data?.data)

  const booking = data?.data

  if (isLoading) {
    return <BookingDetailSkeleton />
  }

  if (error || !booking) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Booking Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The booking you&apos;re looking for doesn&lsquo;t exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Booking Details
            </h1>
            <p className="font-mono text-muted-foreground">
              {booking.bookingRef}
            </p>
          </div>
        </div>

        <Badge
          className={`px-6 py-2 text-base font-semibold ${statusColors[booking.status]}`}
        >
          {booking.status}
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column - Main Info */}
        <div className="space-y-8 lg:col-span-8">
          {/* Customer Info */}
          <Card className="p-8">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold">
              <Users className="h-6 w-6 text-primary" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-2xl font-semibold">
                  {booking.user.firstName} {booking.user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{booking.user.email}</p>
              </div>
              {booking.user.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.user.phone}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Sessions */}
          <Card className="p-8">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold">
              <Calendar className="h-6 w-6 text-primary" />
              Booked Sessions
            </h3>

            <div className="space-y-6">
              {booking.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 rounded-2xl bg-muted/50 p-6"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                    🏏
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xl font-semibold">
                          {item.slot.lane.name}
                        </p>
                        <p className="text-muted-foreground capitalize">
                          {item.slot.lane.type.toLowerCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ${item.unitPrice}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          per hour
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.slot.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {item.slot.startTime} - {item.slot.endTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Up to {item.slot.lane.capacity} people
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="sticky top-6 p-8">
            <h3 className="mb-6 text-xl font-semibold">Booking Summary</h3>

            <div className="space-y-5">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Total Amount</span>
                <span>${booking.totalAmount}</span>
              </div>

              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Discount</span>
                  <span>-${booking.discountAmount}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-2xl font-bold">
                <span>Final Amount</span>
                <span className="text-primary">${booking.finalAmount}</span>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Payment Successful</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paid on{" "}
                  {new Date(
                    booking.payment?.paidAt || booking.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <Button className="mt-8 w-full" size="lg">
              Download Invoice
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Loading Skeleton
function BookingDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <Card className="p-8">
            <Skeleton className="mb-6 h-8 w-64" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
