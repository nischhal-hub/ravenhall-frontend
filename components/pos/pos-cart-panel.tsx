"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ShoppingCart,
  Trash2,
  Tag,
  CreditCard,
  Banknote,
  DollarSign,
  Building2,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Receipt,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  PosCustomerSelector,
  type CustomerSelection,
} from "./pos-customer-selector"
import type { SelectedSlotInfo } from "./pos-slot-grid"
import type {
  PosBookingDetail,
  PosPaymentMethod,
  PosPriceCalculation,
} from "@/types/pos-response.types"
import {
  useCalculatePosPriceMutation,
  useCreatePosBookingMutation,
} from "@/services/mutations/pos.mutations"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PosCartPanelProps {
  selectedSlots: SelectedSlotInfo[]
  onRemoveSlot: (slotId: string) => void
  onClearAllSlots: () => void
  onBookingSuccess: (booking: PosBookingDetail) => void
}

const paymentOptions: Array<{
  value: PosPaymentMethod
  label: string
  icon: typeof DollarSign
}> = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "CARD", label: "Card / EFTPOS", icon: CreditCard },
  { value: "STRIPE", label: "Stripe", icon: DollarSign },
  { value: "BANK_TRANSFER", label: "Transfer", icon: Building2 },
  { value: "OTHER", label: "Other", icon: HelpCircle },
]

export function PosCartPanel({
  selectedSlots,
  onRemoveSlot,
  onClearAllSlots,
  onBookingSuccess,
}: PosCartPanelProps) {
  // Customer selection state
  const [customerSelection, setCustomerSelection] = useState<CustomerSelection>({
    type: "GUEST",
  })

  // Discount states
  const [discountCodeInput, setDiscountCodeInput] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState("")
  const [showCustomDiscount, setShowCustomDiscount] = useState(false)
  const [customDiscountType, setCustomDiscountType] = useState<"PCT" | "FLAT">("PCT")
  const [customDiscountVal, setCustomDiscountVal] = useState<string>("")
  const [discountReason, setDiscountReason] = useState("")

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>("CASH")
  const [paymentStatus, setPaymentStatus] = useState<"SUCCEEDED" | "PENDING">("SUCCEEDED")
  const [cashTendered, setCashTendered] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  // Real-time backend price calculation result
  const [calculatedPrice, setCalculatedPrice] = useState<PosPriceCalculation | null>(null)

  const { mutate: calculatePrice, isPending: isCalculating } = useCalculatePosPriceMutation()
  const { mutate: createBooking, isPending: isBooking } = useCreatePosBookingMutation()

  // Base raw subtotal
  const rawSubtotal = useMemo(() => {
    return selectedSlots.reduce((acc, s) => acc + s.hourlyRate, 0)
  }, [selectedSlots])

  // Recalculate price when slots, customer, promo code, or custom discounts change
  useEffect(() => {
    if (selectedSlots.length === 0) {
      setCalculatedPrice(null)
      return
    }

    const customPct =
      customDiscountType === "PCT" && parseFloat(customDiscountVal) > 0
        ? parseFloat(customDiscountVal)
        : undefined

    const customFlat =
      customDiscountType === "FLAT" && parseFloat(customDiscountVal) > 0
        ? parseFloat(customDiscountVal)
        : undefined

    calculatePrice(
      {
        slotIds: selectedSlots.map((s) => s.slotId),
        customerId:
          customerSelection.type === "EXISTING" ? customerSelection.customer?.id : undefined,
        discountCode: appliedPromoCode || undefined,
        customDiscountPct: customPct,
        customDiscountAmount: customFlat,
      },
      {
        onSuccess: (data) => {
          setCalculatedPrice(data)
        },
        onError: (err) => {
          // If promo code failed, clear promo code
          if (appliedPromoCode) {
            toast.error("Invalid or expired discount code")
            setAppliedPromoCode("")
          }
        },
      }
    )
  }, [
    selectedSlots,
    customerSelection,
    appliedPromoCode,
    customDiscountType,
    customDiscountVal,
    calculatePrice,
  ])

  // Effective display amounts
  const subtotal = calculatedPrice ? calculatedPrice.totalAmount : rawSubtotal
  const finalAmount = calculatedPrice ? calculatedPrice.finalAmount : rawSubtotal
  const totalDiscount = calculatedPrice ? calculatedPrice.discountBreakdown.totalDiscountAmount : 0

  // Cash change calculation
  const tenderedNum = parseFloat(cashTendered) || 0
  const changeDue = Math.max(0, tenderedNum - finalAmount)

  // Apply promo code action
  const handleApplyPromo = () => {
    const trimmed = discountCodeInput.trim().toUpperCase()
    if (!trimmed) return
    setAppliedPromoCode(trimmed)
  }

  const handleRemovePromo = () => {
    setAppliedPromoCode("")
    setDiscountCodeInput("")
  }

  // Handle Checkout / Booking Submission
  const handleCheckout = () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one time slot")
      return
    }

    const customPct =
      customDiscountType === "PCT" && parseFloat(customDiscountVal) > 0
        ? parseFloat(customDiscountVal)
        : undefined

    const customFlat =
      customDiscountType === "FLAT" && parseFloat(customDiscountVal) > 0
        ? parseFloat(customDiscountVal)
        : undefined

    const payload = {
      slotIds: selectedSlots.map((s) => s.slotId),
      paymentMethod,
      paymentStatus,
      discountCode: appliedPromoCode || undefined,
      customDiscountPct: customPct,
      customDiscountAmount: customFlat,
      discountReason: discountReason.trim() || undefined,
      notes: notes.trim() || undefined,
      customerId:
        customerSelection.type === "EXISTING" ? customerSelection.customer?.id : undefined,
      customer:
        customerSelection.type === "WALKIN_FORM" ? customerSelection.walkInData : undefined,
      isGuest: customerSelection.type === "GUEST",
    }

    createBooking(payload as any, {
      onSuccess: (booking) => {
        // Reset states
        onClearAllSlots()
        setAppliedPromoCode("")
        setDiscountCodeInput("")
        setCustomDiscountVal("")
        setDiscountReason("")
        setCashTendered("")
        setNotes("")
        setCustomerSelection({ type: "GUEST" })

        // Trigger receipt modal
        onBookingSuccess(booking)
      },
    })
  }

  return (
    <Card className="h-full flex flex-col bg-card border-border shadow-xs overflow-hidden">
      {/* ── Cart Header ── */}
      <div className="p-4 border-b border-border/70 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingCart className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground">POS Register</h3>
            <p className="text-[11px] text-muted-foreground">Checkout & Ground Booking</p>
          </div>
        </div>

        {selectedSlots.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAllSlots}
            className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section 1: Customer Identification */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Customer</span>
            {customerSelection.customer?.membership?.isActive && (
              <span className="text-[10px] text-accent font-medium">
                Member pricing applied
              </span>
            )}
          </Label>
          <PosCustomerSelector
            value={customerSelection}
            onChange={setCustomerSelection}
          />
        </div>

        <Separator />

        {/* Section 2: Selected Slots (Cart Items) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground">
              Selected Sessions ({selectedSlots.length})
            </Label>
            {isCalculating && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Loader2 className="size-3 animate-spin text-primary" /> Calculating...
              </span>
            )}
          </div>

          {selectedSlots.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-2 bg-muted/20">
              <Clock className="size-6 mx-auto text-muted-foreground/60" />
              <p className="text-xs font-medium text-foreground">No sessions selected</p>
              <p className="text-[11px] text-muted-foreground">
                Click on available time slot pills in the calendar grid to add them to this order.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
              {selectedSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className="rounded-lg border border-border/80 bg-card p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-border transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {slot.laneName}
                      </span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1 capitalize">
                        {slot.laneType.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 font-mono">
                      <span>{slot.startTime} - {slot.endTime}</span>
                      <span>•</span>
                      <span>{slot.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-xs text-foreground font-mono">
                      ${slot.hourlyRate.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveSlot(slot.slotId)}
                      className="size-6 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
                      title="Remove slot"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Section 3: Discounts & Promo Codes */}
        {selectedSlots.length > 0 && (
          <div className="space-y-3">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                Promo / Voucher Code
              </Label>
              {appliedPromoCode ? (
                <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-accent">
                    <Sparkles className="size-3.5" />
                    <span>{appliedPromoCode}</span>
                    {calculatedPrice?.discountCodeRecord && (
                      <span className="text-[10px] font-normal text-muted-foreground">
                        ({calculatedPrice.discountCodeRecord.discountPct}% OFF)
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePromo}
                    className="h-6 px-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Enter code (e.g. SUMMER20)"
                    value={discountCodeInput}
                    onChange={(e) => setDiscountCodeInput(e.target.value)}
                    className="h-8 text-xs font-mono uppercase"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={!discountCodeInput.trim() || isCalculating}
                    className="h-8 text-xs px-3"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Custom Staff Override Collapsible */}
            <div className="rounded-lg border border-border/70 p-2.5 bg-muted/15 space-y-2">
              <button
                type="button"
                onClick={() => setShowCustomDiscount(!showCustomDiscount)}
                className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Percent className="size-3" />
                  Staff Custom Discount Override
                </span>
                {showCustomDiscount ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>

              {showCustomDiscount && (
                <div className="space-y-2 pt-1 border-t border-border/50">
                  <div className="flex gap-2">
                    <div className="flex rounded-md border border-border overflow-hidden h-8">
                      <button
                        type="button"
                        onClick={() => setCustomDiscountType("PCT")}
                        className={cn(
                          "px-2.5 text-xs font-semibold transition-colors",
                          customDiscountType === "PCT"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomDiscountType("FLAT")}
                        className={cn(
                          "px-2.5 text-xs font-semibold transition-colors",
                          customDiscountType === "FLAT"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        $
                      </button>
                    </div>

                    <Input
                      type="number"
                      step={customDiscountType === "PCT" ? "1" : "0.5"}
                      min="0"
                      max={customDiscountType === "PCT" ? "100" : undefined}
                      placeholder={customDiscountType === "PCT" ? "Percentage %" : "Flat amount $"}
                      value={customDiscountVal}
                      onChange={(e) => setCustomDiscountVal(e.target.value)}
                      className="h-8 text-xs font-mono flex-1"
                    />
                  </div>

                  <Input
                    placeholder="Reason for discount (e.g. VIP Club Member, Manager Approved)"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    className="h-8 text-[11px]"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 4: Pricing Breakdown */}
        {selectedSlots.length > 0 && (
          <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs border border-border">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({selectedSlots.length} sessions)</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>

            {calculatedPrice?.discountBreakdown.membership.plan &&
              calculatedPrice.discountBreakdown.membership.discountPct > 0 && (
                <div className="flex justify-between text-accent font-medium">
                  <span>
                    Membership Discount ({calculatedPrice.discountBreakdown.membership.plan}{" "}
                    {calculatedPrice.discountBreakdown.membership.discountPct}%)
                  </span>
                  <span className="font-mono">
                    -${calculatedPrice.discountBreakdown.pctDiscountAmount.toFixed(2)}
                  </span>
                </div>
              )}

            {appliedPromoCode && calculatedPrice?.discountBreakdown.discountCode && (
              <div className="flex justify-between text-accent font-medium">
                <span>Promo Code ({appliedPromoCode})</span>
                <span className="font-mono">
                  -${calculatedPrice.discountBreakdown.pctDiscountAmount.toFixed(2)}
                </span>
              </div>
            )}

            {calculatedPrice && calculatedPrice.discountBreakdown.flatDiscountAmount > 0 && (
              <div className="flex justify-between text-accent font-medium">
                <span>Staff Flat Discount</span>
                <span className="font-mono">
                  -${calculatedPrice.discountBreakdown.flatDiscountAmount.toFixed(2)}
                </span>
              </div>
            )}

            {totalDiscount > 0 && (
              <div className="flex justify-between text-xs font-semibold text-accent pt-1 border-t border-dashed border-border/80">
                <span>Total Discount Saved</span>
                <span className="font-mono">-${totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-baseline justify-between text-sm font-bold text-foreground">
              <span>Payable Total:</span>
              <span className="text-xl font-heading font-black text-primary font-mono">
                ${finalAmount.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">AUD</span>
              </span>
            </div>
          </div>
        )}

        {/* Section 5: Payment Method & Details */}
        {selectedSlots.length > 0 && (
          <div className="space-y-3 pt-1">
            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val as PosPaymentMethod)}
                className="grid grid-cols-3 gap-1.5"
              >
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = paymentMethod === opt.value
                  return (
                    <Label
                      key={opt.value}
                      htmlFor={`cart-method-${opt.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-lg border text-center cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary"
                          : "border-border hover:bg-muted/40 text-foreground"
                      )}
                    >
                      <RadioGroupItem value={opt.value} id={`cart-method-${opt.value}`} className="sr-only" />
                      <Icon className="size-4 mb-1 text-muted-foreground" />
                      <span className="text-[11px] leading-tight">{opt.label}</span>
                    </Label>
                  )
                })}
              </RadioGroup>
            </div>

            {/* Cash Calculator (if cash selected) */}
            {paymentMethod === "CASH" && (
              <div className="rounded-lg border border-dashed border-border bg-card p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="pos-cash-tendered" className="text-[11px]">
                      Cash Tendered ($)
                    </Label>
                    <Input
                      id="pos-cash-tendered"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="h-8 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Change Due ($)</Label>
                    <div
                      className={cn(
                        "h-8 px-2.5 flex items-center rounded-md font-mono text-xs font-bold border",
                        tenderedNum >= finalAmount && finalAmount > 0
                          ? "bg-accent/15 border-accent/40 text-accent font-bold"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      ${changeDue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Quick Cash preset pills */}
                <div className="flex gap-1 overflow-x-auto pt-0.5">
                  {[20, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCashTendered(preset.toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-muted hover:bg-muted/80 text-muted-foreground"
                    >
                      ${preset}
                    </button>
                  ))}
                  {finalAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setCashTendered(finalAmount.toFixed(2))}
                      className="px-2 py-0.5 rounded text-[10px] font-mono border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      Exact (${finalAmount.toFixed(2)})
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Payment Status (Paid Now vs Pay Later) */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Payment Status</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={paymentStatus === "SUCCEEDED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentStatus("SUCCEEDED")}
                  className={cn(
                    "h-8 text-xs font-semibold gap-1.5",
                    paymentStatus === "SUCCEEDED" && "bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  <CheckCircle2 className="size-3.5" />
                  Paid Now
                </Button>
                <Button
                  type="button"
                  variant={paymentStatus === "PENDING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentStatus("PENDING")}
                  className={cn(
                    "h-8 text-xs font-semibold gap-1.5",
                    paymentStatus === "PENDING" && "bg-muted-foreground text-white hover:bg-muted-foreground/90"
                  )}
                >
                  <Clock className="size-3.5" />
                  Pay Later (Pending)
                </Button>
              </div>
            </div>

            {/* Staff / Counter Notes */}
            <div className="space-y-1">
              <Label htmlFor="pos-booking-notes" className="text-xs">
                Counter Notes (optional)
              </Label>
              <Textarea
                id="pos-booking-notes"
                rows={2}
                placeholder="Special notes or instructions for this session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Checkout Button ── */}
      <div className="p-4 border-t border-border bg-card">
        <Button
          type="button"
          onClick={handleCheckout}
          disabled={selectedSlots.length === 0 || isBooking || isCalculating}
          className="w-full h-12 text-sm font-bold gap-2 shadow-md bg-primary hover:bg-primary/95 text-primary-foreground"
        >
          {isBooking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing Sale...
            </>
          ) : selectedSlots.length === 0 ? (
            <>
              <ShoppingCart className="size-4" />
              Select Sessions to Book
            </>
          ) : (
            <>
              <Receipt className="size-4" />
              Complete Sale • ${finalAmount.toFixed(2)} AUD
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
