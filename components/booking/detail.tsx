"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PageHeader from "@/components/ui/page-header"
import { BOOKING_STATUS_CONFIG } from "@/components/reusable/status-badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCancelBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} from "@/services/mutations/booking.mutations"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Hash,
  Layers,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Tag,
  Timer,
  Trash2,
  User,
  XCircle,
  Activity,
  AlertCircle,
  ReceiptText,
  ShieldCheck,
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
        description: string
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
    stripePaymentIntentId: string
    amount: number
    currency: string
    status: string
    refundAmount: number | null
    stripeRefundId: string | null
    paidAt: string | null
  } | null
  discountCode: unknown | null
}

interface BookingDetailPageProps {
  booking: Booking
  isAdmin?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]

const STATUS_ICON: Record<string, React.ElementType> = {
  CONFIRMED: CheckCircle2,
  CANCELLED: XCircle,
  COMPLETED: Activity,
  PENDING: Timer,
}

const STATUS_BAR_COLOR: Record<string, string> = {
  default: "bg-primary",
  secondary: "bg-secondary",
  destructive: "bg-destructive",
  outline: "bg-foreground",
}

function statusConfig(status: string) {
  const key = status.toUpperCase()
  const config = BOOKING_STATUS_CONFIG[key as keyof typeof BOOKING_STATUS_CONFIG] || {
    label: status,
    variant: "secondary" as const,
  }

  return {
    label: config.label,
    variant: config.variant,
    icon: STATUS_ICON[key] || Timer,
    bar: STATUS_BAR_COLOR[config.variant],
  }
}

function paymentStatusConfig(status: string) {
  switch (status.toUpperCase()) {
    case "SUCCEEDED":
    case "PAID":
      return {
        label: "Paid",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
      }
    case "FAILED":
      return {
        label: "Failed",
        className:
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
      }
    case "REFUNDED":
      return {
        label: "Refunded",
        className:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
      }
    default:
      return {
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
      }
  }
}

function formatDate(iso: string) {
  return format(new Date(iso), "dd MMM yyyy")
}

function formatDateTime(iso: string) {
  return format(new Date(iso), "dd MMM yyyy, HH:mm")
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number)
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`
}

function formatCurrency(amount: number, currency = "aud") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-2.5 last:border-0">
      <div className="flex shrink-0 items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span
        className={`max-w-[60%] truncate text-right text-sm font-medium ${
          mono ? "rounded bg-muted px-2 py-0.5 font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BookingDetailPage({
  booking,
  isAdmin,
}: BookingDetailPageProps) {
  console.log("📖 Booking details:", booking) // Debug log
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(booking.status)

  const cancelMutation = useCancelBookingMutation()
  const statusMutation = useUpdateBookingStatusMutation()
  const deleteMutation = useDeleteBookingMutation()

  const statusCfg = statusConfig(booking.status)
  const StatusIcon = statusCfg.icon
  const isCancellable = !["CANCELLED", "COMPLETED"].includes(
    booking.status.toUpperCase()
  )

  const slot = booking.items[0]?.slot
  const lane = slot?.lane
  const payment = booking.payment

  const handleStatusUpdate = () => {
    if (selectedStatus === booking.status) return
    statusMutation.mutate({ id: booking.id, status: selectedStatus })
  }

  const handleCancel = () => {
    cancelMutation.mutate(booking.id)
  }

  const handleDelete = () => {
    deleteMutation.mutate(booking.id, {
      onSuccess: () => router.back(),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {/* Cancel */}
            {isCancellable && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Booking <strong>{booking.bookingRef}</strong> will be
                      cancelled. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Delete — admin only */}
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                      Delete booking?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete{" "}
                      <strong>{booking.bookingRef}</strong> and all associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      {deleteMutation.isPending
                        ? "Deleting…"
                        : "Delete permanently"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* ── Hero header ── */}
        <div className="mb-8">
          <PageHeader
            size="lg"
            title="Booking Detail"
            actions={
              <Badge
                variant={statusCfg.variant}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusCfg.label}
              </Badge>
            }
          />
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-3.5 w-3.5" />
            <span className="font-mono font-semibold">
              {booking.bookingRef}
            </span>
            <span>·</span>
            <span>Created {formatDateTime(booking.createdAt)}</span>
          </div>

          {/* Status progress bar */}
          <div className="mt-6 grid grid-cols-4 gap-1.5">
            {BOOKING_STATUSES.map((s, i) => {
              const steps = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]
              const currentIndex = steps.indexOf(booking.status.toUpperCase())
              const stepIndex = steps.indexOf(s)
              const isCancelled = booking.status.toUpperCase() === "CANCELLED"
              const isActive = isCancelled
                ? s === "CANCELLED"
                : stepIndex <= currentIndex
              return (
                <div key={s} className="space-y-1">
                  <div
                    className={`h-1 rounded-full transition-colors ${
                      isActive
                        ? isCancelled && s === "CANCELLED"
                          ? "bg-rose-500"
                          : statusCfg.bar
                        : "bg-muted"
                    }`}
                  />
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column (2/3) */}
          <div className="space-y-5 lg:col-span-2">
            {/* Customer */}
            <SectionCard icon={User} title="Customer">
              <div className="flex items-center gap-4 pb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                  {booking.user.firstName[0]}
                  {booking.user.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold">
                    {booking.user.firstName} {booking.user.lastName}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {booking.user.role.toLowerCase()}
                    </span>
                    {booking.user.isEmailVerified && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-emerald-200 bg-emerald-50 px-1.5 py-0 text-[10px] text-emerald-700"
                      >
                        <ShieldCheck className="h-2.5 w-2.5" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator className="mb-3" />
              <InfoRow icon={Mail} label="Email" value={booking.user.email} />
              {booking.user.phone && (
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={booking.user.phone}
                />
              )}
            </SectionCard>

            {/* Lane & Slot */}
            {lane && slot && (
              <SectionCard icon={MapPin} title="Lane & Slot">
                <InfoRow icon={MapPin} label="Lane" value={lane.name} />
                <InfoRow
                  icon={Layers}
                  label="Type"
                  value={
                    <Badge variant="secondary" className="text-xs">
                      {lane.type}
                    </Badge>
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Date"
                  value={formatDate(slot.date)}
                />
                <InfoRow
                  icon={Clock}
                  label="Time"
                  value={`${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`}
                />
                <InfoRow
                  icon={User}
                  label="Capacity"
                  value={`${lane.capacity} persons`}
                />
                {lane.description && (
                  <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2.5">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {lane.description}
                    </p>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Payment */}
            {payment && (
              <SectionCard icon={CreditCard} title="Payment">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Payment status
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${paymentStatusConfig(payment.status).className}`}
                  >
                    {paymentStatusConfig(payment.status).label}
                  </Badge>
                </div>
                <Separator className="mb-3" />
                <InfoRow
                  icon={CreditCard}
                  label="Stripe intent"
                  value={payment.stripePaymentIntentId}
                  mono
                />
                <InfoRow
                  icon={DollarSign}
                  label="Charged"
                  value={formatCurrency(payment.amount, payment.currency)}
                />
                {payment.paidAt && (
                  <InfoRow
                    icon={CheckCircle2}
                    label="Paid at"
                    value={formatDateTime(payment.paidAt)}
                  />
                )}
                {payment.refundAmount && (
                  <InfoRow
                    icon={RefreshCw}
                    label="Refund"
                    value={formatCurrency(
                      payment.refundAmount,
                      payment.currency
                    )}
                  />
                )}
                {payment.stripeRefundId && (
                  <InfoRow
                    icon={RefreshCw}
                    label="Refund ID"
                    value={payment.stripeRefundId}
                    mono
                  />
                )}
              </SectionCard>
            )}

            {/* Notes */}
            {booking.notes && (
              <SectionCard icon={ReceiptText} title="Notes">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {booking.notes}
                </p>
              </SectionCard>
            )}
          </div>

          {/* Right column (1/3) */}
          <div className="space-y-5">
            {/* Pricing summary */}
            <SectionCard icon={DollarSign} title="Pricing">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Unit price</span>
                  <span className="font-medium">
                    {formatCurrency(
                      booking.items[0]?.unitPrice ?? 0,
                      payment?.currency
                    )}
                  </span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      Discount
                    </span>
                    <span className="font-medium text-emerald-600">
                      −{" "}
                      {formatCurrency(
                        booking.discountAmount,
                        payment?.currency
                      )}
                    </span>
                  </div>
                )}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total due</span>
                <span className="text-xl font-black text-primary">
                  {formatCurrency(booking.finalAmount, payment?.currency)}
                </span>
              </div>
            </SectionCard>

            {/* Timestamps */}
            <SectionCard icon={Clock} title="Timestamps">
              <div className="space-y-0">
                <InfoRow
                  icon={Calendar}
                  label="Created"
                  value={formatDateTime(booking.createdAt)}
                />
                <InfoRow
                  icon={RefreshCw}
                  label="Updated"
                  value={formatDateTime(booking.updatedAt)}
                />
              </div>
            </SectionCard>

            {/* Admin: update status */}
            {isAdmin && (
              <SectionCard icon={Activity} title="Update Status">
                <div className="space-y-3">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="h-9 w-full text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKING_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-sm">
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="h-9 w-full"
                    onClick={handleStatusUpdate}
                    disabled={
                      selectedStatus === booking.status ||
                      statusMutation.isPending
                    }
                  >
                    {statusMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Applying…
                      </>
                    ) : (
                      "Apply status"
                    )}
                  </Button>
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Usage ────────────────────────────────────────────────────────────────────
//
// app/bookings/[id]/page.tsx
//
// import { BookingDetailPage } from "@/components/BookingDetailPage"
//
// export default async function Page({ params }: { params: { id: string } }) {
//   const booking = await fetchBooking(params.id)          // your server-side fetch
//   return <BookingDetailPage booking={booking} isAdmin={false} />
// }
