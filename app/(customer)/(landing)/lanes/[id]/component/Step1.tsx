"use client"

import { useState, useMemo } from "react"
import { StepIndicator } from "./StepIndicator"
import { MiniCalendar } from "./MiniCalendar"
import { SlotGrid } from "./SlotGrid"
import { BookingSummaryCard } from "./BookingSummaryCard"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Lane, Slot } from "@/types/lane-response.types"

interface Step1Props {
  lane: Lane
  onNext: (date: string, slot: Slot, duration: 1 | 2 | 3) => void
}

export function Step1({ lane, onNext }: Step1Props) {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  )
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [duration, setDuration] = useState<1 | 2 | 3>(1)

  const daySlots = useMemo(() => {
    return lane.slots.filter((s) => s.date.startsWith(selectedDate))
  }, [lane.slots, selectedDate])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left Column */}
      <div className="space-y-4 lg:col-span-3">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Step 1 of 3
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Reserve Your Lane
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select Date & Time
          </p>
        </div>

        <MiniCalendar
          selectedDate={selectedDate}
          onSelect={(d) => {
            setSelectedDate(d)
            setSelectedSlot(null)
          }}
          slots={lane.slots}
        />

        <SlotGrid
          slots={daySlots}
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex justify-end">
          <StepIndicator step={1} />
        </div>

        <BookingSummaryCard
          lane={lane}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          duration={duration}
          onDurationChange={setDuration}
        />

        <Button
          disabled={!selectedSlot}
          onClick={() =>
            selectedSlot && onNext(selectedDate, selectedSlot, duration)
          }
          className="h-11 w-full rounded-xl bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
        >
          Continue to Details →
        </Button>

        <div className="flex gap-3 rounded-xl bg-foreground p-4 text-background">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <p className="mb-0.5 text-xs font-bold text-accent">
              Peak Hour Notice
            </p>
            <p className="text-xs text-background/70">
              Weekend mornings are currently in high demand. Book now to secure
              your preferred slot.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
