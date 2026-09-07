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
  Phone,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useBookingById } from "@/services/queries/bookings.query"
import { formatCurrency } from "@/lib/utils"
import QRCode from "react-qr-code"

export function PaymentLoadingScreen({
  message = "Loading payment details...",
}: {
  message?: string
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      <p className="mt-4 text-lg text-muted-foreground">{message}</p>
    </div>
  )
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookingId = searchParams.get("bookingId")
  const redirectStatus = searchParams.get("redirect_status")

  const { data: bookingData, isLoading } = useBookingById(bookingId || "")

  useEffect(() => {
    if (!bookingId) {
      router.push("/lanes")
    }
  }, [bookingId, router])

  if (isLoading) {
    return <PaymentLoadingScreen message="Verifying your payment..." />
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg p-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/15">
            <CheckCircle className="h-12 w-12 text-accent" />
          </div>

          <h1 className="mb-3 text-3xl font-bold">Booking Confirmed!</h1>

          <p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Your lane is prepped and ready for action. We&apos;ve sent all the
            details to your inbox.
          </p>
        </div>

        {/* Reference number */}
        <p className="mb-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          Reference Number
        </p>
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5">
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-sm font-semibold text-foreground">
            {refNumber}
          </span>
        </div>

        {/* Two-column: details + QR */}
        <div className="flex items-stretch gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-muted px-3 py-3">
              <div className="mt-0.5 shrink-0 rounded-md bg-card p-1.5 shadow-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm leading-tight font-semibold text-foreground">
                  {booking?.lane?.name ?? "Lane 04 – Premium Net"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {booking?.lane?.description ??
                    "Professional bowling machine included"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-muted px-3 py-3">
              <div className="mt-0.5 shrink-0 rounded-md bg-card p-1.5 shadow-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm leading-tight font-semibold text-foreground">
                  {formattedDate ?? "Saturday, October 24th, 2026"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Session Time:{" "}
                  {booking
                    ? `${booking.startTime} — ${booking.endTime} (${durationMins} mins)`
                    : "18:00 — 19:30 (90 mins)"}
                </p>
              </div>
            </div>
          </div>

          {/* Right: QR card */}
          <div className="flex w-36 shrink-0 flex-col items-center justify-between rounded-2xl border border-border bg-muted p-4">
            <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
              <QRCode
                value={qrValue}
                size={96}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="H"
              />
              <p className="px-1 text-center text-[9px] leading-tight font-medium text-gray-500">
                {booking?.user?.fullName ?? "Digital Access Spine"}
              </p>
            </div>
            <p className="mt-2 text-center text-[8px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              Digital Entry Pass
            </p>
          </div>
        </div>

        {/* Confirmation notice */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <p className="text-xs leading-relaxed text-secondary-foreground">
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
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">Amount Paid</span>
            <span className="text-sm font-bold text-foreground">
              {formatCurrency(booking.finalAmount)}
            </span>
          </div>
        )}

        {/* CTA buttons */}
        <div className="mt-5 space-y-2.5">
          <Button
            onClick={() => router.push("/panel/bookings")}
            className="h-12 w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90"
          >
            View My Bookings →
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/lanes")}
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            Book Another Lane
          </Button>
        </div>

        {/* Footer strip */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <MapPin className="mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-foreground">
              The Pavilion
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              Ravenhall Way, Melbourne VIC 3023
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-3">
            <Phone className="mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-foreground">
              Support Desk
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              +61 3 9000 1234
            </p>
            <p className="text-[11px] text-muted-foreground">
              support@ravenhall.cricket
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-primary p-3">
            <p className="text-[9px] font-bold tracking-widest text-accent uppercase">
              Follow the Game
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Share2 className="h-4 w-4 text-primary-foreground" />
              <Users className="h-4 w-4 text-primary-foreground" />
              <Camera className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Booking ID: <span className="font-mono">{bookingId ?? "—"}</span>
          {redirectStatus === "succeeded" && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
              <CheckCircle className="h-2.5 w-2.5" /> Payment verified
            </span>
          )}
        </p>
      </Card>
    </div>
  )
}
