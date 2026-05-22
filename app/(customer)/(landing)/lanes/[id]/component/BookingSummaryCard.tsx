import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lane, Slot } from "@/types/lane-response.types"
import Image from "next/image"

const EQUIPMENT_FEE = 10

interface BookingSummaryCardProps {
  lane: Lane
  selectedDate: string
  selectedSlot: Slot | null
  duration: 1 | 2 | 3
  onDurationChange: (d: 1 | 2 | 3) => void
}

export function BookingSummaryCard({
  lane,
  selectedDate,
  selectedSlot,
  duration,
  onDurationChange,
}: BookingSummaryCardProps) {
  const laneHire = lane.hourlyRate * duration
  const total = laneHire + EQUIPMENT_FEE

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative h-36 bg-linear-to-br from-emerald-900 to-emerald-700">
        {lane.imageUrl ? (
          <Image
            src={lane.imageUrl}
            alt={lane.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 p-4">
            <Badge className="mb-1 w-fit border-0 bg-emerald-500 text-[10px]">
              {lane.type}
            </Badge>
            <p className="text-lg leading-tight font-bold text-white">
              {lane.name}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        {selectedDate && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5 text-emerald-500" />
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
                  <Clock className="size-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Time
                  </span>
                </div>
                <p className="pl-5 font-medium text-foreground">
                  {selectedSlot.startTime} — {selectedSlot.endTime}
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
            <Badge
              variant="outline"
              className="border-emerald-400 text-emerald-600"
            >
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
            <span>${laneHire.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Equipment Fee</span>
            <span>${EQUIPMENT_FEE.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
