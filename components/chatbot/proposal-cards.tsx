"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CalendarDays, Clock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { bookingUrl } from "@/lib/chatbot/routes"
import { formatCurrency } from "@/lib/utils"
import { apiClient } from "@/services/api/client"
import { cancelBookingRequest } from "@/services/mutations/booking.mutations"
import { fetchMyBookings } from "@/components/chatbot/tool-handlers"
import { toast } from "sonner"

type CardShellProps = {
  title: string
  rows: Array<{ icon?: React.ReactNode; text: string }>
  children: React.ReactNode
}

function CardShell({ title, rows, children }: CardShellProps) {
  return (
    <div className="my-1 rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {rows.map((row, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {row.icon}
            {row.text}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">{children}</div>
    </div>
  )
}

// ─── Booking ──────────────────────────────────────────────────────────────

type BookingProposalProps = {
  laneId: string
  date: string
  startTime: string
  /** Called once the customer acts, so the model can continue the conversation. */
  onDone: (result: string) => void
  /** Output already recorded for this call, if any. */
  doneResult?: string
}

/**
 * Shows the slot the model picked, using live data from the API (not the
 * model's text) so the price and time on the card can't be hallucinated.
 * The button hands off to the normal booking flow; nothing is booked here.
 */
export function BookingProposalCard({
  laneId,
  date,
  startTime,
  onDone,
  doneResult,
}: BookingProposalProps) {
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["chatbot", "lane", laneId],
    queryFn: async () => (await apiClient.get(`/lanes/${laneId}`)).data?.data,
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <div className="my-1 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" /> Checking the slot…
      </div>
    )
  }

  const slot = data?.slots?.find(
    (s: { date: string; startTime: string }) =>
      String(s.date).startsWith(date) && s.startTime === startTime
  )

  if (!data || !slot || !slot.isAvailable || slot.isBlocked) {
    return (
      <p className="my-1 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
        That slot is no longer available. Ask me to look for another time.
      </p>
    )
  }

  const slotDate = String(slot.date).slice(0, 10) || date

  return (
    <CardShell
      title={data.name}
      rows={[
        {
          icon: <CalendarDays className="size-3" />,
          text: slotDate,
        },
        {
          icon: <Clock className="size-3" />,
          text: `${slot.startTime} – ${slot.endTime} · ${formatCurrency(data.hourlyRate)}/hr`,
        },
      ]}
    >
      <Button
        size="sm"
        className="flex-1"
        disabled={Boolean(doneResult)}
        onClick={() => {
          onDone("Customer opened the booking page for this slot.")
          router.push(bookingUrl(laneId, slotDate, slot.id))
        }}
      >
        {doneResult ? "Opened" : "Review & pay"}
      </Button>
    </CardShell>
  )
}

// ─── Cancel ───────────────────────────────────────────────────────────────

type CancelProposalProps = {
  bookingId: string
  onDone: (result: string) => void
  doneResult?: string
}

export function CancelProposalCard({
  bookingId,
  onDone,
  doneResult,
}: CancelProposalProps) {
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)

  // Looked up from the customer's own bookings (scoped to their account).
  const { data: booking, isLoading } = useQuery({
    queryKey: ["chatbot", "my-bookings"],
    queryFn: fetchMyBookings,
    select: (list) => list.find((b) => b.id === bookingId),
    staleTime: 10_000,
  })

  if (isLoading) {
    return (
      <div className="my-1 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" /> Finding your booking…
      </div>
    )
  }

  if (!booking) {
    return (
      <p className="my-1 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
        I couldn&apos;t find that booking on your account.
      </p>
    )
  }

  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    return (
      <p className="my-1 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
        Booking {booking.bookingRef} is already {booking.status.toLowerCase()}.
      </p>
    )
  }

  const confirm = async () => {
    setBusy(true)
    try {
      await cancelBookingRequest({ id: booking.id })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["chatbot", "my-bookings"] }),
      ])
      toast.success("Booking cancelled successfully")
      onDone(`Customer confirmed. Booking ${booking.bookingRef} was cancelled.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cancellation failed"
      toast.error(message)
      setBusy(false)
    }
  }

  return (
    <CardShell
      title={`Cancel ${booking.bookingRef}?`}
      rows={[
        { text: `${booking.lane ?? "Lane"} · ${booking.status}` },
        {
          icon: <CalendarDays className="size-3" />,
          text: `${booking.date ?? ""} ${booking.start ?? ""}–${booking.end ?? ""}`,
        },
        {
          text: booking.paid
            ? `${formatCurrency(booking.amount)} will be refunded to your card`
            : formatCurrency(booking.amount),
        },
      ]}
    >
      <Button
        size="sm"
        variant="destructive"
        className="flex-1"
        disabled={busy || Boolean(doneResult)}
        onClick={confirm}
      >
        {busy ? <Loader2 className="size-3 animate-spin" /> : "Confirm cancel"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy || Boolean(doneResult)}
        onClick={() => onDone("Customer decided not to cancel the booking.")}
      >
        Keep it
      </Button>
    </CardShell>
  )
}
