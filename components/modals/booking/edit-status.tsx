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
import { useUpdateBookingStatusMutation } from "@/services/mutations/booking.mutations"
import { useModalContext } from "@/components/context/modal-context"
import { _ModalProps, TModalDataMap } from "@/types/types"
import { updateBookingStatusSchema } from "@/schemas/booking"

export default function EditBookingStatus({
  data,
}: _ModalProps<TModalDataMap["EDIT_BOOKING_STATUS"]>) {
  const { mutate: updateStatus, isPending } = useUpdateBookingStatusMutation()
  const { closeModal } = useModalContext()

  const form = useForm({
    resolver: zodResolver(updateBookingStatusSchema),
    defaultValues: {
      status: data?.status || "PENDING",
    },
  })

  const onSubmit = (formData: any) => {
    if (!data?.id) return

    updateStatus(
      { id: data.id, status: formData.status },
      {
        onSuccess: () => closeModal("EDIT_BOOKING_STATUS"),
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-6 p-2"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Updating..." : "Update Status"}
        </Button>
      </form>
    </Form>
  )
}
