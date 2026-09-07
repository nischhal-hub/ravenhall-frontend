"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { updateLaneSchema } from "@/schemas/lane"
import FormInput from "@/components/reusable/form-input"
import { useUpdateLaneMutation } from "@/services/mutations/lane.mutations"
import { useModalContext } from "@/components/context/modal-context"
import { _ModalProps, TModalDataMap } from "@/types/types"

export default function EditLane({
  data,
}: _ModalProps<TModalDataMap["EDIT_LANE"]>) {
  const { mutate: updateLane, isPending } = useUpdateLaneMutation()
  const { closeModal } = useModalContext()
  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.imageUrl || null
  )

  const form = useForm({
    resolver: zodResolver(updateLaneSchema),
    defaultValues: {
      name: data?.name || "",
      type: data?.type || "GENERAL",
      description: data?.description || "",
      capacity: data?.capacity || 1,
      hourlyRate: data?.hourlyRate || 0,
      image: undefined,
      isActive: data?.isActive ?? true,
    },
  })

  const onSubmit = (formData: Record<string, unknown>) => {
    if (!data?.id) return

    updateLane(
      { id: data.id, ...formData },
      {
        onSuccess: () => closeModal("EDIT_LANE"),
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-6 p-2"
      >
        <h2 className="text-center text-2xl font-bold">Edit Lane</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput form={form} name="name" label="Lane Name" required />
          <FormInput form={form} name="type" label="Lane Type" required />

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
              name="image"
              label="Lane Image"
              render={(field) => (
                <div className="space-y-2">
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-40 rounded-md object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      field.onChange(file)
                      if (file) setImagePreview(URL.createObjectURL(file))
                    }}
                    className="block w-full text-sm"
                  />
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="isActive"
              label="Active"
              render={(field) => (
                <input
                  type="checkbox"
                  checked={field.value as boolean}
                  onChange={field.onChange}
                  className="h-5 w-5"
                />
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Updating..." : "Update Lane"}
        </Button>
      </form>
    </Form>
  )
}
