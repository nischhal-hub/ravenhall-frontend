"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import {
  CreateDiscountCodeFormValues,
  createDiscountCodeSchema,
} from "@/schemas/discount"
import FormInput from "@/components/reusable/form-input"
import { useCreateDiscountCodeMutation } from "@/services/mutations/discount.mutations"

export default function CreateDiscountCodeForm() {
  const mutation = useCreateDiscountCodeMutation()

  const form = useForm({
    resolver: zodResolver(createDiscountCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      discountPct: 10,
      maxUses: undefined,
      validFrom: "",
      validTo: "",
    },
  })

  const onSubmit = (data: CreateDiscountCodeFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        // Optional: toast success
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Code */}
          <FormInput
            form={form}
            name="code"
            label="Discount Code"
            placeholder="SUMMER25"
            required
          />

          {/* Discount Percentage */}
          <FormInput
            form={form}
            name="discountPct"
            label="Discount Percentage (%)"
            type="number"
            placeholder="10"
            required
          />

          {/* Max Uses */}
          <FormInput
            form={form}
            name="maxUses"
            label="Maximum Uses (optional)"
            type="number"
            placeholder="100"
          />

          {/* Description - Using Textarea */}
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="description"
              label="Description"
              type="textarea"
              placeholder="Enter discount description (e.g., Summer seasonal promotion...)"
              rows={4}
            />
          </div>

          {/* Valid From */}
          <div>
            <label className="mb-2 block text-sm">
              Valid From <span className="text-red-600">*</span>
            </label>
            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
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
                        ? format(new Date(field.value), "PPP")
                        : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date?.toISOString().split("T")[0])
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.validFrom && (
              <p className="mt-1 text-[10px] text-red-600">
                {form.formState.errors.validFrom.message}
              </p>
            )}
          </div>

          {/* Valid To */}
          <div>
            <label className="mb-2 block text-sm">
              Valid To <span className="text-red-600">*</span>
            </label>
            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
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
                        ? format(new Date(field.value), "PPP")
                        : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date?.toISOString().split("T")[0])
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.validTo && (
              <p className="mt-1 text-[10px] text-red-600">
                {form.formState.errors.validTo.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Discount Code"}
        </Button>
      </form>
    </Form>
  )
}
