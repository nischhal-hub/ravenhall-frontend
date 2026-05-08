"use client"

import { _ModalProps } from "@/types/types"
import { Button } from "../ui/button"

export default function ExampleSheet({ close }: _ModalProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        This sheet is wired to the shared modal context.
      </p>
      <Button onClick={close}>Close</Button>
    </div>
  )
}
