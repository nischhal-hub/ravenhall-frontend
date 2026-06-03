"use client"
import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  CheckCircle,
  Calendar,
  MapPin,
  Hash,
  Share2,
  Users,
  Camera,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBookingById } from "@/services/queries/bookings.query"
import QRCode from "react-qr-code"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")
  const redirectStatus = searchParams.get("redirect_status")

  const { data: bookingData, isLoading } = useBookingById(bookingId || "")

  useEffect(() => {
    if (!bookingId) router.push("/lanes")
  }, [bookingId, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d3b2e]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
        <p className="mt-4 text-lg text-emerald-200">
          Verifying your payment...
        </p>
      </div>
    )
  }

  const booking = bookingData?.data

  const refNumber = bookingId
    ? `RIC-${new Date().getFullYear()}-${bookingId.slice(-5).toUpperCase()}`
    : "—"

  const formattedDate = booking?.date
    ? new Date(booking.date).toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  const durationMins = booking?.duration != null ? booking.duration * 60 : null

  // QR value encodes the key booking details
  const qrValue = bookingId
    ? JSON.stringify({
        ref: refNumber,
        bookingId,
        lane: booking?.lane?.name ?? "",
        date: booking?.date ?? "",
        time: booking?.startTime ?? "",
      })
    : refNumber

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* ── Hero banner ─────────────────────────────────── */}
      <div className="bg-[#0d3b2e] px-4 pt-12 pb-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-400">
          <CheckCircle className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-emerald-400">
          Booking Confirmed!
        </h1>
        <p className="mb-8 text-muted-foreground">
          Your booking has been confirmed
        </p>

        {booking && (
          <div className="mb-8 space-y-4 rounded-2xl bg-muted/50 p-6 text-left">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 text-muted-foreground" />
              <div>
                {/* @ts-expect-error types not properly defined */}
                <p className="font-medium">{booking.lane?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {/* @ts-expect-error types not properly defined*/}
                  {booking.lane?.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <p>
                {/* @ts-expect-error types not properly defined*/}
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
                {/* @ts-expect-error types not properly defined*/}
                {booking.startTime} — {booking.endTime} ({booking.duration} hour
                {/* @ts-expect-error types not properly defined*/}
                {booking.duration > 1 ? "s" : ""})
              </p>
            </div>

          {/* Amount */}
          {booking?.finalAmount != null && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <span className="text-sm text-gray-500">Amount Paid</span>
              <span className="text-sm font-bold text-gray-800">
                ₹{booking.finalAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* CTA buttons */}
          <div className="mt-5 space-y-2.5">
            <Button
              onClick={() => router.push("/my-bookings")}
              className="h-12 w-full rounded-xl bg-[#0d3b2e] text-sm font-semibold text-white transition-colors hover:bg-[#0a2e24]"
            >
              View My Bookings →
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/lanes")}
              className="h-12 w-full rounded-xl border-gray-200 text-sm font-semibold text-gray-700"
            >
              Book Another Lane
            </Button>
          </div>
        </div>

        {/* ── Footer strip ──────────────────────────────── */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <MapPin className="mb-1.5 h-4 w-4 text-gray-400" />
            <p className="text-xs font-semibold text-gray-800">The Pavilion</p>
            <p className="mt-0.5 text-[11px] leading-snug text-gray-500">
              Ravenhall Way, Melbourne VIC 3023
            </p>
          </div>

          <div className="rounded-xl bg-white p-3 shadow-sm">
            <svg
              className="mb-1.5 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 9.82a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.4a16 16 0 006.29 6.29l.79-.79a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            <p className="text-xs font-semibold text-gray-800">Support Desk</p>
            <p className="mt-0.5 text-[11px] leading-snug text-gray-500">
              +61 3 9000 1234
            </p>
            <p className="text-[11px] text-gray-500">
              support@ravenhall.cricket
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-[#0d3b2e] p-3 shadow-sm">
            <p className="text-[9px] font-bold tracking-widest text-emerald-300 uppercase">
              Follow the Game
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Share2 className="h-4 w-4 text-white" />
              <Users className="h-4 w-4 text-white" />
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-center text-[11px] text-gray-400">
          Booking ID: <span className="font-mono">{bookingId ?? "—"}</span>
          {redirectStatus === "succeeded" && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <CheckCircle className="h-2.5 w-2.5" /> Payment verified
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
