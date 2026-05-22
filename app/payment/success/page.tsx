"use client"
import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookingById } from "@/services/queries/bookings.query"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")

  const { data: bookingData, isLoading } = useBookingById(bookingId || "")

  useEffect(() => {
    if (!bookingId) {
      router.push("/lanes")
    }
  }, [bookingId, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  const booking = bookingData?.data

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Payment Successful!
        </h1>
        <p className="mb-8 text-muted-foreground">
          Your booking has been confirmed
        </p>

        {booking && (
          <div className="mb-8 space-y-4 rounded-2xl bg-muted/50 p-6 text-left">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{booking.lane?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.lane?.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <p>
                {new Date(booking.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="size-5 text-muted-foreground" />
              <p>
                {booking.startTime} — {booking.endTime} ({booking.duration} hour
                {booking.duration > 1 ? "s" : ""})
              </p>
            </div>

            <div className="border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-semibold">₹{booking.finalAmount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/my-bookings")}
            className="h-12 w-full text-base"
          >
            View My Bookings
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="h-12 w-full"
          >
            Back to Home
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Booking ID: <span className="font-mono">{bookingId}</span>
        </p>
      </div>
    </div>
  )
}
