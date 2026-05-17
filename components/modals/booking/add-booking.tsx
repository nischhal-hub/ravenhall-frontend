"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormInput from "@/components/reusable/form-input"
import { useCreateBookingMutation } from "@/services/mutations/booking.mutations"
import { CreateBookingPayload, createBookingSchema } from "@/schemas/booking"

export default function CreateBookingForm() {
  const mutation = useCreateBookingMutation()

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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Lane Selection - You can replace with a proper Select later */}
          <FormInput
            form={form}
            name="laneId"
            label="Select Lane"
            placeholder="Enter Lane ID"
            required
          />

          <FormInput
            form={form}
            name="date"
            label="Booking Date"
            type="date"
            required
          />

          <FormInput form={form} name="startTime" label="Start Time" required />

          <FormInput form={form} name="endTime" label="End Time" required />

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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating Booking..." : "Create Booking"}
        </Button>
      </form>
    </Form>
  )
}
