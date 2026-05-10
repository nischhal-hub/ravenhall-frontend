"use client"

import { Trash2 } from "lucide-react"
import { useDeleteItem } from "@/services/mutations/delete.mutations"
import { useModalContext } from "../context/modal-context"
import { _ModalProps, TModalDataMap } from "@/types/types"
import { Button } from "../ui/button"

export default function DeleteModal({
  initiatorName,
  data,
}: _ModalProps<TModalDataMap["DELETE_ITEM"]>) {
  const { closeModal } = useModalContext()
  const deleteHandler = useDeleteItem()

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl p-6">
      {/* Icon & Title */}
      <div className="flex flex-col items-center gap-2 text-center">
        {/* icon wrapper uses theme colors */}
        <div className="rounded-full bg-destructive/10 p-4">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>

        <h2 className="text-xl font-bold text-foreground">Confirm Deletion</h2>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 p-4 text-white"
          onClick={() =>
            deleteHandler({
              initiatorName: initiatorName || "",
              type: data?.type || "user",
            })
          }
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => closeModal("DELETE_ITEM")}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
