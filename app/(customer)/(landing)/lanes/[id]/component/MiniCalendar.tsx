"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slot } from "@/types/lane-response.types"

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface MiniCalendarProps {
  selectedDate: string
  onSelect: (date: string) => void
  slots: Slot[]
}

export function MiniCalendar({
  selectedDate,
  onSelect,
  slots,
}: MiniCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else setViewMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else setViewMonth((m) => m + 1)
  }

  const hasSlots = (dateStr: string) =>
    slots.some((s) => s.date.startsWith(dateStr))

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-accent" />
          <span className="font-bold text-foreground">
            {MONTHS[viewMonth]} {viewYear}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={nextMonth}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[10px] font-semibold text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const isToday =
            dateStr ===
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
          const isSelected = dateStr === selectedDate
          const isPast = new Date(dateStr) < today
          const hasSlot = hasSlots(dateStr)

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={cn(
                "relative mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-sm font-medium transition-all",
                isPast && "cursor-not-allowed text-muted-foreground/30",
                !isPast && !isSelected && "text-foreground hover:bg-muted",
                isToday && !isSelected && "border border-accent text-accent",
                isSelected && "bg-foreground font-bold text-background"
              )}
            >
              {day}
              {hasSlot && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
