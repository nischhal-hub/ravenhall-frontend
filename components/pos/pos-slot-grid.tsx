"use client"

import { useState } from "react"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Ban,
  Users,
  AlertCircle,
  RefreshCw,
  Volleyball,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { usePosLanesAndSlotsQuery } from "@/services/queries/pos.query"
import type { PosLaneWithSlots, PosSlot } from "@/types/pos-response.types"
import { format, addDays, subDays, isToday, isTomorrow } from "date-fns"
import { cn } from "@/lib/utils"

export interface SelectedSlotInfo {
  slotId: string
  laneId: string
  laneName: string
  laneType: string
  hourlyRate: number
  date: string
  startTime: string
  endTime: string
}

interface PosSlotGridProps {
  selectedSlots: SelectedSlotInfo[]
  onToggleSlot: (slot: SelectedSlotInfo) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function PosSlotGrid({
  selectedSlots,
  onToggleSlot,
  selectedDate,
  onDateChange,
}: PosSlotGridProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL")
  const dateStr = format(selectedDate, "yyyy-MM-dd")

  const {
    data: lanesWithSlots,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = usePosLanesAndSlotsQuery({
    date: dateStr,
  })

  const selectedSlotIdSet = new Set(selectedSlots.map((s) => s.slotId))

  // Filter lanes by type
  const filteredLanes = (lanesWithSlots || []).filter((lane) => {
    if (selectedType === "ALL") return true
    return lane.type.toUpperCase() === selectedType.toUpperCase()
  })

  // Date label helpers
  const getDateLabel = () => {
    if (isToday(selectedDate)) return "Today"
    if (isTomorrow(selectedDate)) return "Tomorrow"
    return format(selectedDate, "EEEE")
  }

  const handleSlotClick = (lane: PosLaneWithSlots, slot: PosSlot) => {
    if (!slot.isAvailable || slot.isBlocked) return

    onToggleSlot({
      slotId: slot.id,
      laneId: lane.id,
      laneName: lane.name,
      laneType: lane.type,
      hourlyRate: lane.hourlyRate,
      date: dateStr,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })
  }

  return (
    <div className="space-y-4">
      {/* ── Top Control Bar: Date Navigation & Quick Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        {/* Date Selector */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onDateChange(subDays(selectedDate, 1))}
            className="size-8"
            title="Previous Day"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 px-3 text-xs font-semibold gap-2 border-primary/20 hover:border-primary/50"
              >
                <CalendarIcon className="size-3.5 text-primary" />
                <span>
                  <strong className="text-primary">{getDateLabel()}</strong>, {format(selectedDate, "dd MMM yyyy")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && onDateChange(d)}
              />
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onDateChange(addDays(selectedDate, 1))}
            className="size-8"
            title="Next Day"
          >
            <ChevronRight className="size-4" />
          </Button>

          {!isToday(selectedDate) && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onDateChange(new Date())}
              className="h-8 text-xs font-medium px-2.5 ml-1"
            >
              Today
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="size-8 text-muted-foreground hover:text-foreground"
            title="Refresh Slots"
          >
            <RefreshCw className={cn("size-3.5", isRefetching && "animate-spin text-primary")} />
          </Button>
        </div>

        {/* Lane Type Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Lanes" },
            { id: "BATTING", label: "Batting" },
            { id: "BOWLING", label: "Bowling" },
            { id: "GENERAL", label: "General" },
          ].map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={selectedType === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedType(tab.id)}
              className={cn(
                "h-7 text-xs rounded-full px-3",
                selectedType === tab.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Visual Legend ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1 text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded border border-accent/40 bg-accent/15" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-primary border border-primary text-primary-foreground flex items-center justify-center">
              <Check className="size-2 text-white stroke-[3]" />
            </span>
            <span className="font-medium text-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-muted border border-border" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-destructive/10 border border-destructive/30" />
            <span>Blocked</span>
          </div>
        </div>

        {selectedSlots.length > 0 && (
          <div className="font-semibold text-primary">
            {selectedSlots.length} {selectedSlots.length === 1 ? "slot" : "slots"} chosen
          </div>
        )}
      </div>

      {/* ── Error state ── */}
      {isError && (
        <div className="p-8 text-center rounded-xl border border-destructive/30 bg-destructive/5 space-y-2">
          <AlertCircle className="size-6 text-destructive mx-auto" />
          <p className="text-sm font-semibold text-destructive">Failed to load lanes & slots availability</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs">
            Try Again
          </Button>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <Skeleton key={j} className="h-10 rounded-lg" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Lane Cards & Slot Grid ── */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {filteredLanes.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-border bg-card space-y-2 text-muted-foreground">
              <Volleyball className="size-8 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-medium">No lanes found</p>
              <p className="text-xs">No active lanes matched the selected filter.</p>
            </div>
          ) : (
            filteredLanes.map((lane) => {
              const availableCount = lane.stats.availableSlots
              const totalCount = lane.stats.totalSlots

              return (
                <Card
                  key={lane.id}
                  className="p-4 bg-card border-border/80 shadow-2xs hover:border-border transition-all"
                >
                  {/* Lane Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Volleyball className="size-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-foreground">
                          {lane.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="capitalize">{lane.type.toLowerCase()} Lane</span>
                          <span>•</span>
                          <span className="font-semibold text-foreground">${lane.hourlyRate.toFixed(2)}/hr</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" /> Max {lane.capacity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lane Slot Availability Counter */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={availableCount > 0 ? "outline" : "secondary"}
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5",
                          availableCount > 0
                            ? "border-accent/40 text-accent font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        {availableCount} of {totalCount} free
                      </Badge>
                    </div>
                  </div>

                  {/* Slots Pill Buttons */}
                  <div className="pt-3">
                    {lane.slots.length === 0 ? (
                      <div className="text-center py-4 text-xs text-muted-foreground italic">
                        No time slots generated for this date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {lane.slots.map((slot) => {
                          const isSelected = selectedSlotIdSet.has(slot.id)
                          const isAvailable = slot.isAvailable && !slot.isBlocked
                          const isBooked = !slot.isAvailable && !slot.isBlocked
                          const isBlocked = slot.isBlocked

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => handleSlotClick(lane, slot)}
                              title={
                                isBooked && slot.currentBooking
                                  ? `Booked by ${slot.currentBooking.customerName} (${slot.currentBooking.bookingRef})`
                                  : isBlocked
                                  ? "Blocked slot"
                                  : isSelected
                                  ? "Click to remove from selection"
                                  : "Click to select slot"
                              }
                              className={cn(
                                "group relative flex flex-col items-center justify-center p-2 rounded-lg text-xs font-mono transition-all duration-150 border select-none",
                                // AVAILABLE & SELECTED
                                isSelected &&
                                  "bg-primary text-primary-foreground border-primary shadow-sm font-semibold scale-[1.02] ring-2 ring-primary/30",
                                // AVAILABLE & NOT SELECTED
                                isAvailable &&
                                  !isSelected &&
                                  "bg-card hover:bg-accent/10 border-accent/40 hover:border-accent text-foreground hover:shadow-2xs cursor-pointer active:scale-95",
                                // BOOKED
                                isBooked &&
                                  "bg-muted/60 border-border/60 text-muted-foreground/80 cursor-not-allowed opacity-75",
                                // BLOCKED
                                isBlocked &&
                                  "bg-destructive/5 border-destructive/20 text-destructive/70 cursor-not-allowed opacity-60"
                              )}
                            >
                              <div className="flex items-center gap-1">
                                <Clock className="size-3 shrink-0 opacity-70" />
                                <span className="font-semibold tracking-tight">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>

                              <div className="text-[10px] mt-0.5 truncate max-w-full">
                                {isSelected ? (
                                  <span className="flex items-center gap-1 font-bold">
                                    <Check className="size-2.5 stroke-[3]" /> Selected
                                  </span>
                                ) : isBooked ? (
                                  <span className="text-muted-foreground truncate block">
                                    {slot.currentBooking?.customerName ? slot.currentBooking.customerName.split(" ")[0] : "Booked"}
                                  </span>
                                ) : isBlocked ? (
                                  <span className="text-destructive flex items-center gap-0.5">
                                    <Ban className="size-2.5" /> Blocked
                                  </span>
                                ) : (
                                  <span className="text-accent font-medium">Free (${lane.hourlyRate})</span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
