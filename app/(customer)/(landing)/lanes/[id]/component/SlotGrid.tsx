import { cn } from "@/lib/utils"
import { Slot } from "@/types/lane-response.types"
import { getSlotRange } from "@/lib/booking"

interface SlotGridProps {
  slots: Slot[]
  selectedSlot: Slot | null
  duration: number
  onSelect: (slot: Slot) => void
}

export function SlotGrid({
  slots,
  selectedSlot,
  duration,
  onSelect,
}: SlotGridProps) {
  // Every slot the chosen session would occupy, e.g. 10:00 + 2h → 10:00, 11:00
  const selectedIds = new Set(
    (selectedSlot ? getSlotRange(slots, selectedSlot, duration) : null)?.map(
      (s) => s.id
    )
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-foreground">Available Slots</h3>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />{" "}
            Available
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-destructive" />{" "}
            Booked
          </span>
        </div>
      </div>

      {slots.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No slots available for this date.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot) => {
            const isBooked = !slot.isAvailable || slot.isBlocked
            // Free, but not enough consecutive free slots after it
            const isTooShort = !isBooked && !getSlotRange(slots, slot, duration)
            const isSelected = selectedSlot?.id === slot.id
            const isIncluded = !isSelected && selectedIds.has(slot.id)

            return (
              <button
                key={slot.id}
                disabled={isBooked || isTooShort}
                onClick={() => onSelect(slot)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all",
                  (isBooked || isTooShort) &&
                    "cursor-not-allowed border-border bg-muted text-muted-foreground/40",
                  isIncluded && "border-foreground/60 bg-foreground/10",
                  !isBooked &&
                    !isTooShort &&
                    !isSelected &&
                    !isIncluded &&
                    "border-border bg-background text-foreground hover:border-accent hover:bg-accent/10",
                  isSelected &&
                    "border-foreground bg-foreground text-background"
                )}
              >
                <span>{slot.startTime}</span>
                <span
                  className={cn(
                    "text-[10px] font-normal",
                    isSelected
                      ? "text-background/70"
                      : isBooked
                        ? "text-destructive"
                        : isTooShort
                          ? "text-muted-foreground/60"
                          : "text-accent"
                  )}
                >
                  {isSelected
                    ? "Selected"
                    : isIncluded
                      ? "Included"
                      : isBooked
                        ? "Booked"
                        : isTooShort
                          ? "Too short"
                          : "Available"}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
