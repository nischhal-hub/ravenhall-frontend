"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import {
  createDiscountCodeSchema,
  type CreateDiscountCodePayload,
} from "@/schemas/discount" // or import from discount.ts
import { _ModalProps, TModalDataMap } from "@/types/types"
import { useModalContext } from "@/components/context/modal-context"
import { useUpdateDiscountCodeMutation } from "@/services/mutations/discount.mutations"
import FormInput from "@/components/reusable/form-input"

export default function EditDiscount({ data }: _ModalProps<TModalDataMap["EDIT_DISCOUNT"]>) {
  const { mutate: updateDiscount, isPending } = useUpdateDiscountCodeMutation()
  const { closeModal } = useModalContext()

  const form = useForm({
    resolver: zodResolver(createDiscountCodeSchema),
    defaultValues: {
      code: data?.code || "",
      description: data?.description || "",
      discountPct: data?.discountPct || 10,
      maxUses: data?.maxUses || undefined,
      validFrom: data?.validFrom ? data.validFrom.split("T")[0] : "",
      validTo: data?.validTo ? data.validTo.split("T")[0] : "",
    },
  })

  const onSubmit = (formData: CreateDiscountCodePayload) => {
    if (!data?.id) return

    updateDiscount(
      { id: data.id, ...formData },
      {
        onSuccess: () => {
          closeModal("EDIT_DISCOUNT")
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-6 p-2"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            form={form}
            name="code"
            label="Discount Code"
            placeholder="SUMMER2025"
            required
          />

          <FormInput
            form={form}
            name="discountPct"
            label="Discount (%)"
            type="number"
            placeholder="15"
            required
          />

          <FormInput
            form={form}
            name="maxUses"
            label="Max Uses (Optional)"
            type="number"
            placeholder="100"
          />

          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="description"
              label="Description"
              type="textarea"
              placeholder="Summer season discount..."
              rows={4}
            />
          </div>

          {/* Valid From */}
          <FormInput
            form={form}
            name="validFrom"
            label="Valid From"
            required
            render={(field) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value as string), "PPP")
                      : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value as string) : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date?.toISOString().split("T")[0])
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          />

          {/* Valid To */}
          <FormInput
            form={form}
            name="validTo"
            label="Valid To"
            required
            render={(field) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value as string), "PPP")
                      : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value as string) : undefined
                    }
                    onSelect={(date) =>
                      field.onChange(date?.toISOString().split("T")[0])
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Updating..." : "Update Discount Code"}
        </Button>
      </form>
    </Form>
  )
}
