"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/reusable/empty-state"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
  getStatusUpdateOptions,
  isBookingCancellable,
} from "@/components/reusable/status-badge"
import {
  AmountRow,
  DetailColumns,
  DetailLayout,
  DetailPageHeader,
  InfoCard,
  InfoList,
  InfoRow,
  StatusTimeline,
  SummaryStrip,
  detailActionClass,
  detailIconActionClass,
  formatDateTime12,
  formatDuration,
  formatLongDate,
  formatTime,
  humanize,
  minutesBetween,
  type TimelineEvent,
} from "@/components/detail"
import { formatCurrency } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useAdminCancelBookingMutation,
  useCancelBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} from "@/services/mutations/booking.mutations"
import {
  AlertCircle,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Flag,
  MapPin,
  MoreHorizontal,
  NotebookPen,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Trash2,
  User,
  XCircle,
  Activity,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Booking {
  id: string
  bookingRef: string
  userId: string
  status: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  notes: string | null
  source?: "ONLINE" | "POS" | string
  bookedById?: string | null
  cancelledAt?: string | null
  cancellationReason?: string | null
  cancelledById?: string | null
  discountCodeId: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string | null
    role: string
    isEmailVerified: boolean
  }
  items: {
    id: string
    bookingId: string
    slotId: string
    unitPrice: number
    subtotal: number
    createdAt: string
    slot: {
      id: string
      laneId: string
      date: string
      startTime: string
      endTime: string
      isAvailable: boolean
      isBlocked: boolean
      lane: {
        id: string
        name: string
        type: string
        description: string | null
        capacity: number
        hourlyRate: number
        imageUrl: string | null
        isActive: boolean
      }
    }
  }[]
  payment: {
    id: string
    bookingId: string
    stripePaymentIntentId: string | null
    paymentMethod?: string
    amount: number
    currency: string
    status: string
    refundAmount: number | null
    stripeRefundId: string | null
    paidAt: string | null
    updatedAt?: string
  } | null
  discountCode: { code?: string } | null
}

interface BookingDetailPageProps {
  booking: Booking
  isAdmin?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_ACTION_LABEL: Record<string, { full: string; short: string }> = {
  CONFIRMED: { full: "Mark as confirmed", short: "Confirm" },
  COMPLETED: { full: "Mark as completed", short: "Complete" },
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  STRIPE: "Card (online)",
  CARD: "Card (in person)",
  CASH: "Cash",
  BANK_TRANSFER: "Bank transfer",
  OTHER: "Other",
}

function cancelledByLabel(booking: Booking, isAdmin?: boolean) {
  if (!booking.cancelledById) return "Cancelled"
  if (booking.cancelledById === booking.userId) {
    return isAdmin ? "Cancelled by the customer" : "Cancelled by you"
  }
  return "Cancelled by staff"
}

/** Why some actions are missing, in plain words */
function actionHint(status: string, isAdmin?: boolean) {
  if (status === "CANCELLED") {
    return isAdmin
      ? "This booking is cancelled, so its status can't be changed."
      : "This booking has been cancelled. There's nothing more to do."
  }
  if (status === "COMPLETED") {
    return isAdmin
      ? "This session is complete, so it can't be cancelled or moved to another status."
      : "This session is complete, so it can no longer be cancelled."
  }
  return undefined
}

function getSessionTimes(items: Booking["items"]) {
  const slots = items
    .map((item) => item.slot)
    .filter(Boolean)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  if (slots.length === 0) return null
  const start = slots[0].startTime
  const end = slots[slots.length - 1].endTime
  return { start, end, minutes: minutesBetween(start, end) }
}

function buildTimeline(
  booking: Booking,
  currency: string | undefined,
  isAdmin?: boolean
): TimelineEvent[] {
  const status = booking.status.toUpperCase()
  const payment = booking.payment
  const paymentStatus = payment?.status.toUpperCase()
  const slot = booking.items[0]?.slot
  const times = getSessionTimes(booking.items)
  const events: TimelineEvent[] = []

  events.push({
    id: "created",
    title: "Booking made",
    icon: PlusCircle,
    date: booking.createdAt,
    description:
      booking.source === "POS" ? "Booked at the counter" : "Booked online",
  })

  if (payment?.paidAt) {
    events.push({
      id: "paid",
      title: "Payment received",
      icon: CreditCard,
      tone: "success",
      date: payment.paidAt,
      description: `${formatCurrency(payment.amount, currency)}${
        payment.paymentMethod
          ? ` · ${PAYMENT_METHOD_LABEL[payment.paymentMethod] ?? humanize(payment.paymentMethod)}`
          : ""
      }`,
    })
  } else if (paymentStatus === "FAILED") {
    events.push({
      id: "payment-failed",
      title: "Payment failed",
      icon: AlertCircle,
      tone: "danger",
      date: payment?.updatedAt,
    })
  }

  if (status === "CONFIRMED" || status === "COMPLETED") {
    events.push({
      id: "confirmed",
      title: "Booking confirmed",
      icon: CheckCircle2,
      tone: "success",
    })
  }

  if (status === "COMPLETED") {
    events.push({
      id: "completed",
      title: "Session completed",
      icon: Flag,
      tone: "success",
      description: slot ? `Played on ${formatLongDate(slot.date)}` : undefined,
    })
  }

  if (status === "CANCELLED") {
    events.push({
      id: "cancelled",
      title: cancelledByLabel(booking, isAdmin),
      icon: XCircle,
      tone: "danger",
      date: booking.cancelledAt,
      description: booking.cancellationReason
        ? `Reason: ${booking.cancellationReason}`
        : "No reason given",
    })
  }

  if (
    (payment?.refundAmount ?? 0) > 0 ||
    paymentStatus === "REFUNDED" ||
    paymentStatus === "PARTIALLY_REFUNDED"
  ) {
    events.push({
      id: "refunded",
      title:
        paymentStatus === "PARTIALLY_REFUNDED" ? "Partly refunded" : "Refunded",
      icon: RotateCcw,
      tone: "muted",
      date: payment?.updatedAt,
      description: payment?.refundAmount
        ? `${formatCurrency(payment.refundAmount, currency)} returned to the original payment method`
        : undefined,
    })
  }

  // What happens next, so first-time customers know what to expect
  if (status === "PENDING") {
    events.push({
      id: "next-confirm",
      title: "Waiting for confirmation",
      icon: Clock,
      upcoming: true,
      description: isAdmin
        ? "Confirm the booking once it's been checked."
        : "You'll get a notification once it's confirmed.",
    })
  } else if (status === "CONFIRMED" && slot) {
    events.push({
      id: "next-session",
      title: "Your session",
      icon: CalendarCheck2,
      upcoming: true,
      description: `${formatLongDate(slot.date)}${
        times ? `, ${formatTime(times.start)} – ${formatTime(times.end)}` : ""
      }`,
    })
  }

  return events
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BookingDetailPage({
  booking,
  isAdmin,
}: BookingDetailPageProps) {
  const router = useRouter()
  const statusOptions = getStatusUpdateOptions(booking.status)
  const [cancelReason, setCancelReason] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)

  // One cancel action for both portals; admins hit the staff endpoint, which
  // can cancel any booking and notifies the customer
  const customerCancelMutation = useCancelBookingMutation()
  const adminCancelMutation = useAdminCancelBookingMutation()
  const cancelMutation = isAdmin ? adminCancelMutation : customerCancelMutation
  const statusMutation = useUpdateBookingStatusMutation()
  const deleteMutation = useDeleteBookingMutation()

  const status = booking.status.toUpperCase()
  const isCancellable = isBookingCancellable(booking.status)
  const nextStatus = isAdmin ? statusOptions[0] : undefined
  const nextStatusLabel = nextStatus
    ? STATUS_ACTION_LABEL[nextStatus]
    : undefined
  const hint = actionHint(status, isAdmin)

  const slot = booking.items[0]?.slot
  const lane = slot?.lane
  const times = getSessionTimes(booking.items)
  const payment = booking.payment
  const currency = payment?.currency
  const timeline = buildTimeline(booking, currency, isAdmin)
  // No money has moved yet (no payment, or one that was never completed)
  const isUncharged =
    !payment ||
    (!payment.paidAt &&
      !payment.refundAmount &&
      payment.status.toUpperCase() !== "SUCCEEDED")
  const customerName = `${booking.user.firstName} ${booking.user.lastName}`

  const handleStatusUpdate = () => {
    if (!nextStatus) return
    statusMutation.mutate({ id: booking.id, status: nextStatus })
  }

  const handleCancel = () => {
    cancelMutation.mutate(
      { id: booking.id, reason: cancelReason.trim() || undefined },
      { onSuccess: () => setCancelReason("") }
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(booking.id, {
      onSuccess: () => router.back(),
    })
  }

  // ── Actions ──
  const cancelAction = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!isCancellable}
          aria-describedby={!isCancellable ? "booking-action-hint" : undefined}
          className={`${detailActionClass} border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive`}
        >
          <XCircle />
          <span className="md:hidden">
            {isAdmin ? "Cancel" : "Cancel booking"}
          </span>
          <span className="hidden md:inline">Cancel booking</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Booking <strong>{booking.bookingRef}</strong> will be cancelled and
            its slot released. Online payments are refunded automatically.{" "}
            {isAdmin
              ? "The customer will be notified in-app and by email."
              : "You'll receive a confirmation email."}{" "}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-1.5">
          <label
            htmlFor="cancel-reason"
            className="text-xs font-medium text-muted-foreground"
          >
            Reason (optional{isAdmin ? ", shared with the customer" : ""})
          </label>
          <Textarea
            id="cancel-reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            maxLength={500}
            placeholder={
              isAdmin
                ? "e.g. Lane closed for maintenance"
                : "e.g. Can no longer make it"
            }
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  const statusAction = nextStatus && nextStatusLabel && (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={detailActionClass}
          disabled={statusMutation.isPending}
        >
          {statusMutation.isPending ? (
            <RefreshCw className="animate-spin" />
          ) : (
            <CheckCircle2 />
          )}
          <span className="md:hidden">{nextStatusLabel.short}</span>
          <span className="hidden md:inline">{nextStatusLabel.full}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{nextStatusLabel.full}?</AlertDialogTitle>
          <AlertDialogDescription>
            Booking <strong>{booking.bookingRef}</strong> will move from{" "}
            {humanize(status).toLowerCase()} to{" "}
            {humanize(nextStatus).toLowerCase()}. This can&apos;t be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not now</AlertDialogCancel>
          <AlertDialogAction onClick={handleStatusUpdate}>
            {nextStatusLabel.full}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  const moreMenu = isAdmin && (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="More actions"
            className={detailIconActionClass}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 />
            Delete booking
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Delete booking?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{booking.bookingRef}</strong>{" "}
              and all associated data. To keep a record, cancel it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )

  // Customers only see Cancel while it's possible; admins keep it visible
  // (disabled, explained by the hint) next to their other actions
  const hasActions = isAdmin || isCancellable
  const actions = hasActions && (
    <>
      {statusAction}
      {cancelAction}
      {moreMenu}
    </>
  )

  return (
    <DetailLayout>
      <DetailPageHeader
        backHref={isAdmin ? "/admin/bookings" : "/panel/bookings"}
        backLabel="Bookings"
        title={booking.bookingRef}
        copyLabel="Booking reference"
        status={
          <BookingStatusBadge
            status={status}
            showIcon
            className="h-6 px-2.5 text-xs [&>svg]:size-3.5!"
          />
        }
        meta={`Booked ${formatDateTime12(booking.createdAt)}${
          isAdmin ? ` by ${customerName}` : ""
        }`}
        actions={actions || undefined}
        hint={hint}
        hintId="booking-action-hint"
      />

      <SummaryStrip
        items={[
          {
            icon: Calendar,
            label: "Date",
            value: slot ? formatLongDate(slot.date) : "—",
          },
          {
            icon: Clock,
            label: "Time",
            value: times
              ? `${formatTime(times.start)} – ${formatTime(times.end)}`
              : "—",
            sub: times ? formatDuration(times.minutes) : undefined,
          },
          {
            icon: MapPin,
            label: "Lane",
            value: lane?.name ?? "—",
            sub: lane ? `${humanize(lane.type)} lane` : undefined,
          },
          {
            icon: DollarSign,
            label: "Total",
            value: formatCurrency(booking.finalAmount, currency),
            sub: isUncharged ? (
              status === "CANCELLED" ? (
                "Not charged"
              ) : (
                "Not paid yet"
              )
            ) : (
              <PaymentStatusBadge status={payment!.status} className="mt-1" />
            ),
          },
        ]}
      />

      <DetailColumns
        main={
          <>
            {status === "CANCELLED" && (
              <Alert variant="destructive" className="px-4 py-3">
                <XCircle />
                <AlertTitle className="text-sm font-semibold">
                  {cancelledByLabel(booking, isAdmin)}
                  {booking.cancelledAt &&
                    ` on ${formatDateTime12(booking.cancelledAt)}`}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {booking.cancellationReason
                    ? `Reason: ${booking.cancellationReason}`
                    : "No reason was given."}
                  {payment?.refundAmount
                    ? ` A refund of ${formatCurrency(payment.refundAmount, currency)} was issued.`
                    : ""}
                </AlertDescription>
              </Alert>
            )}

            <InfoCard icon={CalendarCheck2} title="Booking details">
              <InfoList>
                <InfoRow
                  label="Booking reference"
                  value={booking.bookingRef}
                  copyValue={booking.bookingRef}
                />
                <InfoRow label="Lane" value={lane?.name} />
                <InfoRow
                  label="Lane type"
                  value={lane ? humanize(lane.type) : undefined}
                />
                <InfoRow
                  label="Date"
                  value={slot ? formatLongDate(slot.date) : undefined}
                />
                <InfoRow
                  label="Time"
                  value={
                    times
                      ? `${formatTime(times.start)} – ${formatTime(times.end)} (${formatDuration(times.minutes)})`
                      : undefined
                  }
                />
                <InfoRow
                  label="Lane capacity"
                  value={lane ? `Up to ${lane.capacity} people` : undefined}
                />
                <InfoRow
                  label="Booked via"
                  value={booking.source === "POS" ? "At the counter" : "Online"}
                />
                {lane?.description && (
                  <InfoRow
                    full
                    label="About this lane"
                    value={lane.description}
                  />
                )}
              </InfoList>
            </InfoCard>

            <InfoCard icon={User} title={isAdmin ? "Customer" : "Your details"}>
              <InfoList>
                <InfoRow label="Name" value={customerName} />
                <InfoRow
                  label="Email"
                  value={
                    isAdmin ? (
                      <a
                        href={`mailto:${booking.user.email}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {booking.user.email}
                      </a>
                    ) : (
                      booking.user.email
                    )
                  }
                  copyValue={booking.user.email}
                />
                <InfoRow label="Phone" value={booking.user.phone} />
                <InfoRow
                  label="Email verified"
                  value={
                    booking.user.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2
                          className="size-3.5 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        Yes
                      </span>
                    ) : (
                      "Not yet"
                    )
                  }
                />
                {isAdmin && (
                  <InfoRow
                    label="Account type"
                    value={humanize(booking.user.role)}
                  />
                )}
              </InfoList>
            </InfoCard>

            <InfoCard icon={NotebookPen} title="Notes">
              {booking.notes ? (
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {booking.notes}
                </p>
              ) : (
                <EmptyState
                  size="sm"
                  title="No notes"
                  description="Nothing extra was added to this booking."
                  className="py-4"
                />
              )}
            </InfoCard>
          </>
        }
        aside={
          <>
            <InfoCard icon={CreditCard} title="Payment">
              <div className="space-y-2">
                <AmountRow
                  label={
                    booking.items.length > 1
                      ? `Session price (${booking.items.length} slots)`
                      : "Session price"
                  }
                  value={formatCurrency(booking.totalAmount, currency)}
                />
                {booking.discountAmount > 0 && (
                  <AmountRow
                    label={
                      booking.discountCode?.code
                        ? `Discount (${booking.discountCode.code})`
                        : "Discount"
                    }
                    value={`− ${formatCurrency(booking.discountAmount, currency)}`}
                  />
                )}
              </div>
              <Separator className="my-3" />
              <AmountRow
                emphasis
                label="Total"
                value={formatCurrency(booking.finalAmount, currency)}
              />

              <Separator className="my-4" />
              {payment ? (
                <InfoList columns={1}>
                  <InfoRow
                    label="Payment status"
                    value={<PaymentStatusBadge status={payment.status} />}
                  />
                  <InfoRow
                    label="Payment method"
                    value={
                      payment.paymentMethod
                        ? (PAYMENT_METHOD_LABEL[payment.paymentMethod] ??
                          humanize(payment.paymentMethod))
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Paid on"
                    value={
                      payment.paidAt
                        ? formatDateTime12(payment.paidAt)
                        : undefined
                    }
                  />
                  {(payment.refundAmount ?? 0) > 0 && (
                    <InfoRow
                      label="Refunded"
                      value={formatCurrency(payment.refundAmount, currency)}
                    />
                  )}
                  {isAdmin && payment.stripePaymentIntentId && (
                    <InfoRow
                      label="Payment reference"
                      value={payment.stripePaymentIntentId}
                      copyValue={payment.stripePaymentIntentId}
                      mono
                    />
                  )}
                  {isAdmin && payment.stripeRefundId && (
                    <InfoRow
                      label="Refund reference"
                      value={payment.stripeRefundId}
                      copyValue={payment.stripeRefundId}
                      mono
                    />
                  )}
                </InfoList>
              ) : (
                <EmptyState
                  size="sm"
                  icon={CreditCard}
                  title="No payment yet"
                  description={
                    isAdmin
                      ? "No payment has been recorded for this booking."
                      : "You haven't been charged for this booking."
                  }
                  className="py-2"
                />
              )}
            </InfoCard>

            <InfoCard icon={Activity} title="Activity">
              <StatusTimeline events={timeline} />
            </InfoCard>
          </>
        }
      />
    </DetailLayout>
  )
}
