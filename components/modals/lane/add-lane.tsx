"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { useCreateBookingMutation } from "@/services/mutations/booking.mutations"
import { useLaneQuery } from "@/services/queries/lane.query"
import {
  createBookingSchema,
  type CreateBookingPayload,
} from "@/schemas/booking"
import FormInput from "@/components/reusable/form-input"

export default function CreateBookingForm() {
  const mutation = useCreateBookingMutation()

  // Fixed data extraction
  const { data: response, isLoading: lanesLoading } = useLaneQuery({})

  // Extract lanes array safely
  const lanes = response?.data?.lanes

  const form = useForm<CreateBookingPayload>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      laneId: "",
      date: "",
      startTime: "",
      endTime: "",
      numberOfPeople: 4,
      specialRequests: "",
    },
  })

  const onSubmit = (data: CreateBookingPayload) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Lane Selector - FIXED */}
          <FormField
            control={form.control}
            name="laneId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Select Lane <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          lanesLoading ? "Loading lanes..." : "Select a lane"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lanes?.map((lane) => (
                      <SelectItem key={lane.id} value={lane.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{lane.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {lane.type.toLowerCase()} • Capacity:{" "}
                            {lane.capacity} • Rs{lane.hourlyRate}/hr
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            form={form}
            name="date"
            label="Booking Date"
            type="date"
            required
          />
          <FormInput
            form={form}
            name="startTime"
            label="Start Time"
            type="time"
            required
          />
          <FormInput
            form={form}
            name="endTime"
            label="End Time"
            type="time"
            required
          />
          <FormInput
            form={form}
            name="numberOfPeople"
            label="Number of People"
            type="number"
            required
          />

          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="specialRequests"
              label="Special Requests (Optional)"
              type="textarea"
              placeholder="Any special requirements..."
              rows={4}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || lanesLoading}
        >
          {mutation.isPending ? "Creating Booking..." : "Create Booking"}
        </Button>
      </form>
    </Form>
  )
}
