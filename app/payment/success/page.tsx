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
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-emerald-200">
          Your lane is prepped and ready for action. We&apos;ve sent all the
          details to your inbox.
        </p>
      </div>

      {/* ── Main card ───────────────────────────────────── */}
      <div className="mx-auto -mt-10 w-full max-w-lg px-4 pb-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {/* Reference number */}
          <p className="mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Reference Number
          </p>
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <Hash className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-mono text-sm font-semibold text-gray-700">
              {refNumber}
            </span>
          </div>

          {/* Two-column: details + QR */}
          <div className="flex items-stretch gap-4">
            {/* Left: booking details */}
            <div className="flex-1 space-y-3">
              {/* Lane */}
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <div className="mt-0.5 shrink-0 rounded-md bg-white p-1.5 shadow-sm">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm leading-tight font-semibold text-gray-800">
                    {booking?.lane?.name ?? "Lane 04 – Premium Net"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {booking?.lane?.description ??
                      "Professional bowling machine included"}
                  </p>
                </div>
              </div>

              {/* Date + time */}
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <div className="mt-0.5 shrink-0 rounded-md bg-white p-1.5 shadow-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm leading-tight font-semibold text-gray-800">
                    {formattedDate ?? "Saturday, October 24th, 2026"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Session Time:{" "}
                    {booking
                      ? `${booking.startTime} — ${booking.endTime} (${durationMins} mins)`
                      : "18:00 — 19:30 (90 mins)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: QR card — matches screenshot exactly */}
            <div className="flex w-36 shrink-0 flex-col items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-inner">
              {/* White inner card with QR */}
              <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
                <QRCode
                  value={qrValue}
                  size={96}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="H"
                />
                <p className="px-1 text-center text-[9px] leading-tight font-medium text-gray-500">
                  {booking?.user?.fullName ??
                    booking?.user?.name ??
                    "Digital Access Spine"}
                </p>
              </div>
              {/* Label at bottom */}
              <p className="mt-2 text-center text-[8px] font-bold tracking-[0.15em] text-gray-400 uppercase">
                Digital Entry Pass
              </p>
            </div>
          </div>

          {/* Confirmation notice */}
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs leading-relaxed text-blue-700">
              A confirmation email has been sent to{" "}
              <span className="font-semibold">
                {booking?.user?.email ?? "your@email.com"}
              </span>
              . Please check your spam folder if you don&apos;t see it within 5
              minutes.
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
