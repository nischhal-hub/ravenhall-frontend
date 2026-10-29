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
import {
  updateBookingStatusSchema,
  type UpdateBookingStatusPayload,
} from "@/schemas/booking"
import {
  BOOKING_STATUS_CONFIG,
  getStatusUpdateOptions,
} from "@/components/reusable/status-badge"

export default function EditBookingStatus({
  data,
}: _ModalProps<TModalDataMap["EDIT_BOOKING_STATUS"]>) {
  const { mutate: updateStatus, isPending } = useUpdateBookingStatusMutation()
  const { closeModal } = useModalContext()
  const options = getStatusUpdateOptions(
    data?.status ?? "",
    data?.payment?.status
  )

  const form = useForm({
    resolver: zodResolver(updateBookingStatusSchema),
    defaultValues: {
      status: options[0],
    },
  })

  if (options.length === 0) {
    return (
      <p className="p-2 text-sm text-muted-foreground">
        {data?.status?.toUpperCase() === "PENDING"
          ? "This booking hasn't been paid yet. It's confirmed automatically once the online payment goes through; for counter bookings, record the payment at the POS."
          : `This booking is ${data?.status?.toLowerCase()} and its status can no longer be changed.`}
      </p>
    )
  }

  const onSubmit = (formData: UpdateBookingStatusPayload) => {
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
                  {options.map((s) => (
                    <SelectItem key={s} value={s}>
                      {BOOKING_STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                To cancel, open the booking and use “Cancel booking”.
              </p>
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
