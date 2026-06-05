"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { createLaneSchema, CreateLaneFormValues } from "@/schemas/lane"
import FormInput from "@/components/reusable/form-input"
import { useCreateLaneMutation } from "@/services/mutations/lane.mutations"
import { useModalContext } from "@/components/context/modal-context"
import { _ModalProps } from "@/types/types"

export default function AddLane({}: _ModalProps) {
  const { mutate: createLane, isPending } = useCreateLaneMutation()
  const { closeModal } = useModalContext()

  const form = useForm({
    resolver: zodResolver(createLaneSchema),
    defaultValues: {
      name: "",
      type: "GENERAL",
      description: "",
      capacity: 1,
      hourlyRate: 0,
      imageUrl: "",
    },
  })

  const onSubmit = (formData: CreateLaneFormValues) => {
    createLane(formData, {
      onSuccess: () => closeModal("ADD_LANE"),
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-6 p-2"
      >
        <h2 className="text-center text-2xl font-bold">Add New Lane</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput form={form} name="name" label="Lane Name" required />

          {/* Type Dropdown */}
          <FormInput
            form={form}
            name="type"
            label="Lane Type"
            required
            render={(field) => (
              <Select
                onValueChange={(value: string) => field.onChange(value)}
                defaultValue={field.value as string}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lane type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">GENERAL</SelectItem>
                  <SelectItem value="BATTING">BATTING</SelectItem>
                  <SelectItem value="BOWLING">BOWLING</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <FormInput
            form={form}
            name="capacity"
            label="Capacity"
            type="number"
            required
          />

          <FormInput
            form={form}
            name="hourlyRate"
            label="Hourly Rate ($)"
            type="number"
            required
          />

          <div className="md:col-span-2">
            <FormInput form={form} name="description" label="Description" />
          </div>

          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="imageUrl"
              label="Image URL"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Lane"}
        </Button>
      </form>
    </Form>
  )
}
