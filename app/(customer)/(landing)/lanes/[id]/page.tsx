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
import type { CheckoutResult } from "@/services/mutations/payment.mutations"

export default function BookingPage() {
  const params = useParams()
  const laneId = typeof params?.id === "string" ? params.id : undefined

  const { data, isLoading, error } = useLaneByIdQuery(laneId)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null)
  const [bookingDuration, setBookingDuration] = useState<1 | 2 | 3>(1)
  const [bookingEndTime, setBookingEndTime] = useState("")
  // Started in Step 2; the booking itself is only created once it's paid
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null)

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

  const handleStep2Next = (started: CheckoutResult) => {
    setCheckout(started)
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
            {step === 3 && bookingSlot && checkout && (
              <Step3
                lane={lane}
                date={bookingDate}
                slot={bookingSlot}
                duration={bookingDuration}
                endTime={bookingEndTime}
                checkout={checkout}
                onBack={() => setStep(2)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
