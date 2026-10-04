"use client"

import { useState } from "react"
import {
  CreditCard,
  History,
  Store,
  CalendarCheck,
  User,
  Sparkles,
  ShieldCheck,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import PageHeader from "@/components/ui/page-header"
import { PosSlotGrid, type SelectedSlotInfo } from "./pos-slot-grid"
import { PosCartPanel } from "./pos-cart-panel"
import { PosTransactionsTable } from "./pos-transactions-table"
import { PosReceiptModal } from "./pos-receipt-modal"
import { PosCollectPaymentModal } from "./pos-collect-payment-modal"
import { useMeQuery } from "@/services/queries/auth"
import type { PosBookingDetail, PosBookingListItem } from "@/types/pos-response.types"
import { format } from "date-fns"

export default function PosTerminal() {
  const { data: currentUser } = useMeQuery()

  // Selected date on the POS grid
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Selected slots in cart
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlotInfo[]>([])

  // Active top-level tab ("terminal" vs "history")
  const [activeTab, setActiveTab] = useState<string>("terminal")

  // Receipt Modal State
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptBookingId, setReceiptBookingId] = useState<string | null>(null)

  // Collect Payment Modal State
  const [collectPaymentOpen, setCollectPaymentOpen] = useState(false)
  const [collectBooking, setCollectBooking] = useState<PosBookingListItem | null>(null)

  // Toggle slot selection (add if not present, remove if present)
  const handleToggleSlot = (slot: SelectedSlotInfo) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.slotId === slot.slotId)
      if (exists) {
        return prev.filter((s) => s.slotId !== slot.slotId)
      } else {
        return [...prev, slot]
      }
    })
  }

  const handleRemoveSlot = (slotId: string) => {
    setSelectedSlots((prev) => prev.filter((s) => s.slotId !== slotId))
  }

  const handleClearAllSlots = () => {
    setSelectedSlots([])
  }

  // After checkout success
  const handleBookingSuccess = (booking: PosBookingDetail) => {
    setReceiptBookingId(booking.id)
    setReceiptOpen(true)
  }

  // Open receipt for specific booking from history
  const handleOpenReceiptFromHistory = (bookingId: string) => {
    setReceiptBookingId(bookingId)
    setReceiptOpen(true)
  }

  // Open collect payment modal
  const handleOpenCollectPayment = (booking: PosBookingListItem) => {
    setCollectBooking(booking)
    setCollectPaymentOpen(true)
  }

  // After collect payment success
  const handlePaymentSuccess = (bookingId: string) => {
    setReceiptBookingId(bookingId)
    setReceiptOpen(true)
  }

  const cashierName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Counter Staff"

  return (
    <div className="space-y-6">
      {/* ── Page Header with Live Terminal Status ── */}
      <PageHeader
        size="lg"
        title="Point of Sale (POS)"
        description="Front-desk register for walk-in bookings, lane reservations, and counter payments"
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-1.5 text-xs shadow-2xs">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span className="text-muted-foreground">Register Online</span>
              <span className="text-border">|</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <User className="size-3 text-primary" />
                {cashierName}
              </span>
            </div>
          </div>
        }
      />

      {/* ── POS Navigation Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-xl h-10 w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="terminal" className="gap-2 text-xs font-semibold px-4">
            <Store className="size-4" />
            POS Register
            {selectedSlots.length > 0 && (
              <Badge variant="default" className="size-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                {selectedSlots.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 text-xs font-semibold px-4">
            <History className="size-4" />
            Transactions History
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: REGISTER TERMINAL ── */}
        <TabsContent value="terminal" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: Lane & Time Slot Availability Grid */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <PosSlotGrid
                selectedSlots={selectedSlots}
                onToggleSlot={handleToggleSlot}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>

            {/* RIGHT: Register Cart & Instant Checkout Panel */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-4">
              <PosCartPanel
                selectedSlots={selectedSlots}
                onRemoveSlot={handleRemoveSlot}
                onClearAllSlots={handleClearAllSlots}
                onBookingSuccess={handleBookingSuccess}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 2: TRANSACTIONS & SALES HISTORY ── */}
        <TabsContent value="history" className="space-y-4 outline-none">
          <PosTransactionsTable
            onOpenReceipt={handleOpenReceiptFromHistory}
            onOpenCollectPayment={handleOpenCollectPayment}
          />
        </TabsContent>
      </Tabs>

      {/* ── Thermal Receipt Dialog ── */}
      <PosReceiptModal
        open={receiptOpen}
        onClose={() => {
          setReceiptOpen(false)
          setReceiptBookingId(null)
        }}
        bookingId={receiptBookingId}
        onNewSale={() => {
          setSelectedSlots([])
          setActiveTab("terminal")
        }}
      />

      {/* ── Collect Payment Dialog (for pending bookings) ── */}
      <PosCollectPaymentModal
        open={collectPaymentOpen}
        onClose={() => {
          setCollectPaymentOpen(false)
          setCollectBooking(null)
        }}
        booking={collectBooking}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
