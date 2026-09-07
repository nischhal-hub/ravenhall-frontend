"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
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
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function CreateDiscountCodeForm() {
  const mutation = useCreateDiscountCodeMutation()
  const queryClient = useQueryClient()

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
        queryClient.invalidateQueries({ queryKey: ["discounts"] })
        toast.success("Discount code created successfully!")
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
                      : "Pick start date"}
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
                      : "Pick end date"}
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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Discount Code"}
        </Button>
      </form>
    </Form>
  )
}
