"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet"
import { _ModalProps } from "@/types/types"
import { useModalContext } from "@/components/context/modal-context"
import { cn } from "@/lib/utils"
type SheetComponentProps<T extends object> = {
  sheetKey: Keys.TSheetKeys
  title?: string
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  contentClassName?: string
  children: (props: _ModalProps<T>) => React.ReactNode
}

export function SheetComponent<T extends object>({
  sheetKey,
  title,
  side = "right",
  showCloseButton = true,
  contentClassName,
  children,
}: SheetComponentProps<T>) {
  const { modals, close } = useModalContext()
  const sheetState = modals[sheetKey]
  const isOpen = Boolean(sheetState?.open) && sheetState?.type !== "modal"

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close(sheetKey)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side={side}
        className={cn("p-4", contentClassName)}
        showCloseButton={showCloseButton}
      >
        {title && (
          <SheetHeader className="p-0">
            <SheetTitle className="text-lg font-medium">{title}</SheetTitle>
          </SheetHeader>
        )}
        {children({
          data: sheetState?.data as T | undefined,
          initiatorName: sheetState?.initiatorName,
          close: () => close(sheetKey),
        })}
      </SheetContent>
    </Sheet>
  )
}
