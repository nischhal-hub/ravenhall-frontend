/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { useLaneQuery } from "@/services/queries/lane.query"
import { useSlots } from "@/services/queries/slot.query"
import { useCreateBookingMutation } from "@/services/mutations/booking.mutations"

// Simple schema - only lane and slot
const bookingSchema = z.object({
  laneId: z.string().min(1, "Lane is required"),
  slotId: z.string().min(1, "Time slot is required"),
})

type BookingPayload = z.infer<typeof bookingSchema>

export default function CreateAdminBooking() {
  const { mutate: createBooking, isPending } = useCreateBookingMutation()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const form = useForm<BookingPayload>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      laneId: "",
      slotId: "",
    },
  })

  // Get selected lane ID from form
  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedLaneId = form.watch("laneId")

  // Fetch all lanes
  const { data: lanesData, isLoading: lanesLoading } = useLaneQuery({
    page: 1,
    limit: 100,
  })

  const lanes = Array.isArray(lanesData?.data)
    ? lanesData.data
    : lanesData?.data?.lanes || []

  // Fetch slots based on selected lane and date
  const { data: slotsData, isLoading: slotsLoading } = useSlots({
    laneId: selectedLaneId,
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
  })

  const slots = slotsData?.data || []

  // Reset slot when lane or date changes
  useEffect(() => {
    form.setValue("slotId", "")
  }, [selectedLaneId, selectedDate, form])

  const onSubmit = (formData: BookingPayload) => {
    // Create payload with lane and slot
    const bookingPayload = {
      laneId: formData.laneId,
      slotId: formData.slotId,
    }

    createBooking(bookingPayload as any, {
      onSuccess: () => {
        toast.success("Booking created successfully!")
        form.reset()
        setSelectedDate(new Date())
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to create booking")
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 rounded-lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Create New Booking</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Select a lane, choose a date and time slot
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* LANE SELECTION */}
          <FormField
            control={form.control}
            name="laneId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Select Lane *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose a lane" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lanesLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading lanes...
                        </div>
                      </SelectItem>
                    ) : lanes.length > 0 ? (
                      lanes.map((lane: any) => (
                        <SelectItem key={lane.id} value={lane.id}>
                          {lane.name} ({lane.type})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-lanes" disabled>
                        No lanes available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Choose which lane to book</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DATE SELECTION */}
          {selectedLaneId && (
            <div className="space-y-2">
              <label className="text-base font-semibold">Select Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-11 w-full justify-start text-left font-normal",
                      !selectedDate && "text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* SLOT SELECTION */}
          {selectedLaneId && selectedDate && (
            <FormField
              control={form.control}
              name="slotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Select Time Slot *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {slotsLoading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading slots...
                          </div>
                        </SelectItem>
                      ) : slots.length > 0 ? (
                        slots.map((slot: any) => (
                          <SelectItem
                            key={slot.id}
                            value={slot.id}
                            disabled={!slot.isAvailable || slot.isBlocked}
                          >
                            <span>
                              {slot.startTime} — {slot.endTime}
                              {slot.isBlocked && " (Blocked)"}
                              {!slot.isAvailable &&
                                !slot.isBlocked &&
                                " (Booked)"}
                            </span>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-slots" disabled>
                          No slots available for this date
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Showing available slots for{" "}
                    {selectedDate && format(selectedDate, "MMM dd, yyyy")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* SUBMIT BUTTON */}
          {form.watch("slotId") && (
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1"
                onClick={() => {
                  form.reset()
                  setSelectedDate(new Date())
                }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="h-11 flex-1 gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Booking
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
