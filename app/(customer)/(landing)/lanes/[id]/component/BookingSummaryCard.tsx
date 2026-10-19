import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lane, Slot } from "@/types/lane-response.types"
import Image from "next/image"

import { calculateBookingPrice } from "@/lib/booking"

interface BookingSummaryCardProps {
  lane: Lane
  selectedDate: string
  selectedSlot: Slot | null
  /** End of the whole session (start + duration); null until a slot is picked. */
  endTime: string | null
  duration: 1 | 2 | 3
  memberDiscountPct: number
  onDurationChange: (d: 1 | 2 | 3) => void
}

export function BookingSummaryCard({
  lane,
  selectedDate,
  selectedSlot,
  endTime,
  duration,
  memberDiscountPct,
  onDurationChange,
}: BookingSummaryCardProps) {
  const price = calculateBookingPrice({
    hourlyRate: lane.hourlyRate,
    duration,
    memberDiscountPct,
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-36 bg-linear-to-br from-primary to-secondary">
        {lane.imageUrl ? (
          <Image
            src={lane.imageUrl}
            alt={lane.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 p-4">
            <Badge className="mb-1 w-fit border-0 bg-accent text-[10px] text-accent-foreground">
              {lane.type}
            </Badge>
            <p className="text-lg leading-tight font-bold text-primary-foreground">
              {lane.name}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        {selectedDate && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5 text-accent" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Date
              </span>
            </div>
            <p className="pl-5 font-medium text-foreground">
              {new Date(selectedDate).toLocaleDateString("en-AU", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            {selectedSlot && (
              <>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-accent" />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Time
                  </span>
                </div>
                <p className="pl-5 font-medium text-foreground">
                  {selectedSlot.startTime} — {endTime ?? selectedSlot.endTime}
                </p>
              </>
            )}
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Duration
            </span>
            <Badge variant="outline" className="border-accent text-accent">
              Recommended
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => onDurationChange(d as 1 | 2 | 3)}
                className={cn(
                  "rounded-lg border py-2 text-sm font-semibold transition-all",
                  duration === d
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:border-foreground/40"
                )}
              >
                {d} Hr
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Lane Hire ({duration} Hr)</span>
            <span>${price.laneHire.toFixed(2)}</span>
          </div>
          {memberDiscountPct > 0 && (
            <div className="flex justify-between text-accent">
              <span>Member Discount ({memberDiscountPct}%)</span>
              <span>-${price.memberDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Equipment Fee</span>
            <span>${price.equipmentFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
            <span>Total</span>
            <span>${price.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
