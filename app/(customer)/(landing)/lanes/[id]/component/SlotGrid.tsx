import { cn } from "@/lib/utils"
import { Slot } from "@/types/lane-response.types"

interface SlotGridProps {
  slots: Slot[]
  selectedSlot: Slot | null
  onSelect: (slot: Slot) => void
}

export function SlotGrid({ slots, selectedSlot, onSelect }: SlotGridProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-foreground">Available Slots</h3>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />{" "}
            Available
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />{" "}
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
            const isSelected = selectedSlot?.id === slot.id

            return (
              <button
                key={slot.id}
                disabled={isBooked}
                onClick={() => onSelect(slot)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all",
                  isBooked &&
                    "cursor-not-allowed border-border bg-muted text-muted-foreground/40",
                  !isBooked &&
                    !isSelected &&
                    "border-border bg-background text-foreground hover:border-emerald-400 hover:bg-emerald-50",
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
                        ? "text-red-400"
                        : "text-emerald-500"
                  )}
                >
                  {isSelected ? "Selected" : isBooked ? "Booked" : "Available"}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
