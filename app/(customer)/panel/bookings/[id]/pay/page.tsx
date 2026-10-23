"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { CalendarCheck2, CircleCheck, CreditCard, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/reusable/empty-state"
import { type Booking } from "@/components/booking/detail"
import { StripeCheckout } from "@/components/payment/stripe-checkout"
import {
  AmountRow,
  DetailColumns,
  DetailError,
  DetailLayout,
  DetailNotFound,
  DetailPageHeader,
  DetailSkeleton,
  InfoCard,
  InfoList,
  InfoRow,
  formatDuration,
  formatLongDate,
  formatTime,
  isNotFoundError,
  minutesBetween,
} from "@/components/detail"
import { useNow } from "@/hooks/use-now"
import { isSlotPast } from "@/lib/booking"
import { formatCurrency } from "@/lib/utils"
import { useBookingById } from "@/services/queries/bookings.query"

/** Message card for bookings that can't be paid for (paid, cancelled, started) */
function CannotPay({
  icon,
  title,
  description,
  bookingId,
}: {
  icon: React.ElementType
  title: string
  description: string
  bookingId: string
}) {
  return (
    <DetailLayout className="pb-8">
      <Card className="mx-auto mt-10 max-w-md px-6">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          action={
            <Button asChild className="h-11 w-full text-sm md:h-9">
              <Link href={`/panel/bookings/${bookingId}`}>View booking</Link>
            </Button>
          }
        />
      </Card>
    </DetailLayout>
  )
}

export default function CompletePaymentPage() {
  const params = useParams()
  const id = params?.id as string
  const now = useNow()
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useBookingById(id)

  if (isLoading)
    return <DetailSkeleton summary={false} mainCards={1} asideCards={1} />

  if (isNotFoundError(error) || (!isError && !data?.data)) {
    return (
      <DetailNotFound
        title="Booking not found"
        description="This booking doesn't exist or may have been deleted."
        backHref="/panel/bookings"
        backLabel="Bookings"
      />
    )
  }

  if (isError || !data) {
    return (
      <DetailError
        title="We couldn't load this booking"
        error={error}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        backHref="/panel/bookings"
        backLabel="Bookings"
      />
    )
  }

  const booking = data.data as unknown as Booking
  const status = booking.status.toUpperCase()
  const slots = booking.items
    .map((item) => item.slot)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const first = slots[0]
  const last = slots[slots.length - 1]

  if (status === "CONFIRMED" || status === "COMPLETED") {
    return (
      <CannotPay
        icon={CircleCheck}
        title="This booking is already paid"
        description="There's nothing left to pay. Your booking is confirmed."
        bookingId={booking.id}
      />
    )
  }
  if (status === "CANCELLED") {
    return (
      <CannotPay
        icon={XCircle}
        title="This booking was cancelled"
        description="A cancelled booking can't be paid for. You can book a new time from the Lanes page."
        bookingId={booking.id}
      />
    )
  }
  if (first && isSlotPast(first, now)) {
    return (
      <CannotPay
        icon={CalendarCheck2}
        title="This session has already started"
        description="It can no longer be paid for. Cancel it from the booking page and book a new time."
        bookingId={booking.id}
      />
    )
  }

  return (
    <DetailLayout>
      <DetailPageHeader
        backHref={`/panel/bookings/${booking.id}`}
        backLabel="Booking"
        title="Complete your payment"
        meta={`Booking ${booking.bookingRef}. Your slot is held until you pay or cancel.`}
      />

      <DetailColumns
        main={
          <InfoCard icon={CreditCard} title="Payment">
            <StripeCheckout bookingId={booking.id} />
          </InfoCard>
        }
        aside={
          <InfoCard icon={CalendarCheck2} title="Booking summary">
            <InfoList columns={1}>
              <InfoRow label="Booking reference" value={booking.bookingRef} />
              <InfoRow label="Lane" value={first?.lane.name} />
              <InfoRow
                label="Date"
                value={first ? formatLongDate(first.date) : undefined}
              />
              <InfoRow
                label="Time"
                value={
                  first && last
                    ? `${formatTime(first.startTime)} – ${formatTime(last.endTime)} (${formatDuration(minutesBetween(first.startTime, last.endTime))})`
                    : undefined
                }
              />
            </InfoList>
            <div className="mt-5 space-y-2 border-t border-border pt-4">
              <AmountRow
                label="Session price"
                value={formatCurrency(booking.totalAmount)}
              />
              {booking.discountAmount > 0 && (
                <AmountRow
                  label="Discount"
                  value={`− ${formatCurrency(booking.discountAmount)}`}
                />
              )}
              <AmountRow
                emphasis
                label="Total to pay"
                value={formatCurrency(booking.finalAmount)}
              />
            </div>
          </InfoCard>
        }
      />
    </DetailLayout>
  )
}
