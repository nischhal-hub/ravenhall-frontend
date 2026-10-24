"use client"

import { useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLaneByIdQuery } from "@/services/queries/lane.query"
import { useMemberDiscount } from "@/services/queries/membership.query"
import { BookingPageSkeleton } from "./component/BookingPageSkeleton"
import { Step1 } from "./component/Step1"
import { Step2 } from "./component/Step2"
import { Step3 } from "./component/Step3"
import type { Slot } from "@/types/lane-response.types"

export default function BookingPage() {
  const params = useParams()
  const laneId = typeof params?.id === "string" ? params.id : undefined

  const { data, isLoading, error } = useLaneByIdQuery(laneId)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null)
  const [bookingDuration, setBookingDuration] = useState<1 | 2 | 3>(1)
  const [bookingEndTime, setBookingEndTime] = useState("")
  const [appliedPromo, setAppliedPromo] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  // ✅ FIX 1: Store bookingId in state so Step3 can receive it
  const [bookingId, setBookingId] = useState("")

  const lane = data?.data
  const { discountPct: memberDiscountPct, isLoading: isMemberLoading } =
    useMemberDiscount()

  // Deep link from the chat assistant: ?date=YYYY-MM-DD&slotId=...
  const searchParams = useSearchParams()
  const initialDate = searchParams.get("date") ?? undefined
  const initialSlotId = searchParams.get("slotId") ?? undefined

  const handleStep1Next = (
    date: string,
    slot: Slot,
    duration: 1 | 2 | 3,
    endTime: string
  ) => {
    setBookingDate(date)
    setBookingSlot(slot)
    setBookingDuration(duration)
    setBookingEndTime(endTime)
    setStep(2)
  }

  // ✅ FIX 2: Accept and store bookingId from Step2's onNext callback
  const handleStep2Next = (promo: string, discount: number, id: string) => {
    setAppliedPromo(promo)
    setPromoDiscount(discount)
    setBookingId(id)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading && <BookingPageSkeleton />}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <h2 className="text-xl font-bold">Failed to load lane</h2>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !error && !lane && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <AlertCircle className="size-10 text-muted-foreground" />
            <h2 className="text-xl font-bold">Lane not found</h2>
          </div>
        )}

        {!isLoading && lane && (
          <>
            {step === 1 && (
              <Step1
                lane={lane}
                memberDiscountPct={memberDiscountPct}
                onNext={handleStep1Next}
                initialDate={initialDate}
                initialSlotId={initialSlotId}
              />
            )}
            {step === 2 && bookingSlot && (
              <Step2
                lane={lane}
                date={bookingDate}
                slot={bookingSlot}
                duration={bookingDuration}
                endTime={bookingEndTime}
                memberDiscountPct={memberDiscountPct}
                isMemberLoading={isMemberLoading}
                onNext={handleStep2Next}
                onBack={() => setStep(1)}
              />
            )}
            {/* ✅ FIX 3: Pass bookingId to Step3 */}
            {step === 3 && bookingSlot && (
              <Step3
                lane={lane}
                date={bookingDate}
                slot={bookingSlot}
                duration={bookingDuration}
                endTime={bookingEndTime}
                memberDiscountPct={memberDiscountPct}
                promo={appliedPromo}
                promoDiscount={promoDiscount}
                bookingId={bookingId}
                onBack={() => setStep(2)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
