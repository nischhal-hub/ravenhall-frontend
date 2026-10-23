"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  AlertTriangle,
  CheckCircle,
  Calendar,
  Loader2,
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
import { confirmPaymentRequest } from "@/services/mutations/payment.mutations"
import { formatCurrency } from "@/lib/utils"
import { formatTime, minutesBetween } from "@/components/detail"
import { contactInfo } from "@/components/pages/landing/data"
import QRCode from "react-qr-code"

// Same contact details as the site footer
const [address, phone, email] = contactInfo.map((c) => c.text)

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

/** Card for every outcome other than "paid" */
function StatusCard({
  tone,
  title,
  description,
  bookingId,
  showRetry,
}: {
  tone: "processing" | "problem"
  title: string
  description: string
  bookingId: string
  showRetry?: boolean
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md p-8 text-center shadow-lg" role="status">
        <div
          className={
            tone === "processing"
              ? "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15"
              : "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15"
          }
        >
          {tone === "processing" ? (
            <Loader2 className="h-8 w-8 animate-spin text-secondary motion-reduce:animate-none" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="space-y-2.5">
          {showRetry && (
            <Button
              asChild
              className="h-12 w-full rounded-xl text-sm font-semibold"
            >
              <Link href={`/panel/bookings/${bookingId}/pay`}>Try again</Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            <Link href={`/panel/bookings/${bookingId}`}>View booking</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const bookingId = searchParams.get("bookingId")

  // The server checks the payment with Stripe, so this is right even if the
  // webhook hasn't arrived yet. Keep checking while it's still processing.
  const confirm = useQuery({
    queryKey: ["payment-confirm", bookingId],
    queryFn: () => confirmPaymentRequest({ bookingId: bookingId! }),
    enabled: !!bookingId,
    retry: 1,
    refetchInterval: (query) =>
      query.state.data?.outcome === "processing" ? 3000 : false,
  })
  const outcome = confirm.data?.outcome

  const { data: bookingData, isLoading: bookingLoading } = useBookingById(
    bookingId || ""
  )

  useEffect(() => {
    if (!bookingId) {
      router.push("/lanes")
    }
  }, [bookingId, router])

  // Once paid, refresh anything that still shows the booking as pending
  useEffect(() => {
    if (outcome === "paid") {
      queryClient.invalidateQueries({ queryKey: ["booking"] })
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }
  }, [outcome, queryClient])

  if (!bookingId || confirm.isPending || bookingLoading) {
    return <PaymentLoadingScreen message="Checking your payment..." />
  }

  if (confirm.isError) {
    return (
      <StatusCard
        tone="problem"
        title="We couldn't check your payment"
        description="If you were charged, your booking will confirm automatically and we'll email you. You can check its status on the booking page."
        bookingId={bookingId}
      />
    )
  }

  if (outcome === "processing") {
    return (
      <StatusCard
        tone="processing"
        title="Your payment is processing"
        description="This usually takes a few seconds. You can leave this page; we'll email you as soon as your booking is confirmed."
        bookingId={bookingId}
      />
    )
  }

  if (outcome !== "paid") {
    return (
      <StatusCard
        tone="problem"
        title={
          outcome === "failed"
            ? "Your payment didn't go through"
            : "Payment not completed"
        }
        description="You haven't been charged. Your slot is still held, so you can try again or use a different card."
        bookingId={bookingId}
        showRetry
      />
    )
  }

  const booking = bookingData?.data
  const slots = (booking?.items ?? [])
    .map((item) => item.slot)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const first = slots[0]
  const last = slots[slots.length - 1]
  const refNumber = booking?.bookingRef ?? confirm.data?.bookingRef ?? "—"

  const formattedDate = first
    ? new Date(first.date).toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null
  const durationMins =
    first && last ? minutesBetween(first.startTime, last.endTime) : null
  const customerName = booking
    ? `${booking.user.firstName} ${booking.user.lastName}`
    : ""

  const qrValue = JSON.stringify({
    ref: refNumber,
    bookingId,
    lane: first?.lane?.name ?? "",
    date: first?.date ?? "",
    time: first?.startTime ?? "",
  })

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
            Your payment went through and your lane is booked. We&apos;ve sent
            the details to your inbox.
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
          <div className="min-w-0 flex-1 space-y-3">
            {first && (
              <div className="flex items-start gap-3 rounded-xl bg-muted px-3 py-3">
                <div className="mt-0.5 shrink-0 rounded-md bg-card p-1.5 shadow-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-tight font-semibold text-foreground">
                    {first.lane.name}
                  </p>
                  {first.lane.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {first.lane.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {first && last && (
              <div className="flex items-start gap-3 rounded-xl bg-muted px-3 py-3">
                <div className="mt-0.5 shrink-0 rounded-md bg-card p-1.5 shadow-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm leading-tight font-semibold text-foreground">
                    {formattedDate}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatTime(first.startTime)} – {formatTime(last.endTime)}
                    {durationMins ? ` (${durationMins} mins)` : ""}
                  </p>
                </div>
              </div>
            )}
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
              {customerName && (
                <p className="px-1 text-center text-[9px] leading-tight font-medium text-gray-500">
                  {customerName}
                </p>
              )}
            </div>
            <p className="mt-2 text-center text-[8px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              Digital Entry Pass
            </p>
          </div>
        </div>

        {/* Confirmation notice */}
        {booking?.user?.email && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p className="text-xs leading-relaxed text-foreground">
              A confirmation email is on its way to{" "}
              <span className="font-semibold">{booking.user.email}</span>.
              Please check your spam folder if you don&apos;t see it within 5
              minutes.
            </p>
          </div>
        )}

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
            onClick={() => router.push(`/panel/bookings/${bookingId}`)}
            className="h-12 w-full rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90"
          >
            View My Booking →
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/lanes")}
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            Book Another Lane
          </Button>
        </div>

        {/* Footer strip: same details as the site footer */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <MapPin className="mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-foreground">Visit Us</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {address}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-3">
            <Phone className="mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold text-foreground">Support</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {phone}
            </p>
            <p className="text-[11px] break-all text-muted-foreground">
              {email}
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
      </Card>
    </div>
  )
}
