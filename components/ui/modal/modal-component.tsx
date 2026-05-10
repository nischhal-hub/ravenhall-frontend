"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { _ModalProps } from "@/types/types"
import { useModalContext } from "@/components/context/modal-context"

type ModalComponentProps<T extends object> = {
  modalKey: Keys.TModalKeys
  title?: string
  showCloseButton?: boolean
  contentClassName?: string
  children: (props: _ModalProps<T>) => React.ReactNode
}

export function ModalComponent<T extends object>({
  modalKey,
  title,
  showCloseButton = true,
  contentClassName,
  children,
}: ModalComponentProps<T>) {
  const { modals, closeModal } = useModalContext()
  const modalState = modals[modalKey]
  const isOpen = Boolean(modalState?.open) && modalState?.type !== "sheet"

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal(modalKey)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={contentClassName}
        showCloseButton={showCloseButton}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children({
          data: modalState?.data as T | undefined,
          initiatorName: modalState?.initiatorName,
          closeModal: () => closeModal(modalKey),
        })}
      </DialogContent>
    </Dialog>
  )
}
