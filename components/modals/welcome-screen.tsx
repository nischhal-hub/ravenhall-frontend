"use client"

import { _ModalProps } from "@/types/types"
import { Button } from "../ui/button"

export default function WelcomeScreen({ close }: _ModalProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Welcome to the web dashboard preview.
      </p>
      <Button onClick={close}>Close</Button>
    </div>
  )
}
