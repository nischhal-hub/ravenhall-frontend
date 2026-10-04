"use client"

import { useRef } from "react"
import { Printer, CheckCircle, Clock, MapPin, Phone, Mail, User, Receipt as ReceiptIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { usePosReceiptQuery } from "@/services/queries/pos.query"
import type { PosReceipt } from "@/types/pos-response.types"
import { format } from "date-fns"

interface PosReceiptModalProps {
  open: boolean
  onClose: () => void
  bookingId?: string | null
  receiptData?: PosReceipt | null
  onNewSale?: () => void
}

export function PosReceiptModal({
  open,
  onClose,
  bookingId,
  receiptData,
  onNewSale,
}: PosReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  // Fetch receipt if not directly provided
  const { data: fetchedReceipt, isLoading } = usePosReceiptQuery(
    !receiptData && bookingId ? bookingId : undefined
  )

  const receipt = receiptData || fetchedReceipt

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ReceiptIcon className="size-4" />
              </div>
              <DialogTitle className="text-lg font-bold">Counter Receipt</DialogTitle>
            </div>
            {receipt && (
              <Badge variant={receipt.payment?.status === "SUCCEEDED" ? "default" : "secondary"}>
                {receipt.payment?.status === "SUCCEEDED" ? "PAID" : receipt.bookingStatus}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs">Generating receipt...</p>
          </div>
        ) : !receipt ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">Receipt details unavailable</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* PRINTABLE THERMAL RECEIPT AREA */}
            <div
              ref={receiptRef}
              id="printable-receipt"
              className="rounded-lg border border-dashed border-border bg-card p-6 shadow-xs font-mono text-xs space-y-4"
            >
              {/* Header */}
              <div className="text-center space-y-1">
                <h3 className="font-heading font-black text-base tracking-tight uppercase text-foreground">
                  {receipt.venue.name}
                </h3>
                <p className="text-muted-foreground flex items-center justify-center gap-1">
                  <MapPin className="size-3 inline" /> {receipt.venue.address}
                </p>
                <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-3">
                  <span>
                    <Phone className="size-3 inline" /> {receipt.venue.phone}
                  </span>
                  <span>
                    <Mail className="size-3 inline" /> {receipt.venue.email}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-border my-2" />

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Receipt No: </span>
                  <span className="font-semibold text-foreground">{receipt.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Date: </span>
                  <span className="font-semibold text-foreground">
                    {format(new Date(receipt.issuedAt), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cashier: </span>
                  <span className="font-semibold text-foreground">{receipt.cashier}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">Source: </span>
                  <span className="font-semibold text-foreground">FRONT DESK POS</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="rounded bg-muted/40 p-2.5 space-y-0.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <User className="size-3 text-muted-foreground" />
                  <span>{receipt.customer.name}</span>
                  {receipt.customer.isGuest && (
                    <Badge variant="outline" className="text-[9px] py-0 px-1">
                      Guest
                    </Badge>
                  )}
                </div>
                {receipt.customer.phone && (
                  <p className="text-muted-foreground pl-4.5">Phone: {receipt.customer.phone}</p>
                )}
                {receipt.customer.email && (
                  <p className="text-muted-foreground pl-4.5">Email: {receipt.customer.email}</p>
                )}
              </div>

              <div className="border-t border-dashed border-border my-2" />

              {/* Line Items */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 text-[11px] font-bold text-muted-foreground uppercase border-b pb-1">
                  <span className="col-span-6">Item / Lane</span>
                  <span className="col-span-3 text-center">Time</span>
                  <span className="col-span-3 text-right">Amount</span>
                </div>
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-[11px] py-1 border-b border-border/40">
                    <div className="col-span-6">
                      <p className="font-semibold text-foreground">{item.laneName}</p>
                      <p className="text-[10px] text-muted-foreground">{item.laneType}</p>
                    </div>
                    <div className="col-span-3 text-center self-center text-muted-foreground">
                      {item.time}
                    </div>
                    <div className="col-span-3 text-right self-center font-semibold text-foreground">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 pt-2 text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>${receipt.pricing.subtotal.toFixed(2)}</span>
                </div>
                {receipt.pricing.discount > 0 && (
                  <div className="flex justify-between text-accent font-medium">
                    <span>
                      Discount {receipt.pricing.discountCode ? `(${receipt.pricing.discountCode})` : ""}:
                    </span>
                    <span>-${receipt.pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-1.5 flex justify-between text-sm font-bold text-foreground">
                  <span>Total Amount (AUD):</span>
                  <span className="text-base text-primary">${receipt.pricing.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t border-dashed border-border pt-3 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-bold text-foreground">{receipt.payment?.method || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="font-semibold text-foreground">{receipt.payment?.status || receipt.bookingStatus}</span>
                </div>
                {receipt.payment?.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid At:</span>
                    <span>{format(new Date(receipt.payment.paidAt), "dd/MM/yyyy HH:mm:ss")}</span>
                  </div>
                )}
              </div>

              {receipt.notes && (
                <div className="rounded bg-muted/30 p-2 text-[10px] text-muted-foreground italic">
                  Note: {receipt.notes}
                </div>
              )}

              {/* Receipt Footer Message */}
              <div className="text-center pt-2 text-[10px] text-muted-foreground border-t border-dashed border-border space-y-1">
                <p className="font-semibold">Thank you for playing at Ravenhall!</p>
                <p>Please arrive 10 minutes before your booked session.</p>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/80">
                  *** RETAIN THIS RECEIPT FOR CHECK-IN ***
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full sm:w-1/2 gap-2"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                Print Thermal Receipt
              </Button>
              {onNewSale ? (
                <Button
                  className="w-full sm:w-1/2 gap-2"
                  onClick={() => {
                    onClose()
                    onNewSale()
                  }}
                >
                  <CheckCircle className="size-4" />
                  Start New Sale
                </Button>
              ) : (
                <Button className="w-full sm:w-1/2" onClick={onClose}>
                  Done
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
