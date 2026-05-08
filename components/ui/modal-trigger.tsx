import { Slot } from "radix-ui"
import { useModalContext } from "../context/modal-context"
import { Button } from "./button"
import { cn } from "@/lib/utils"

type BaseModalTriggerProps<T extends Record<string, unknown>> = {
  data?: T
  initiatorName?: string
  children: React.ReactNode
  asChild?: boolean
  disabled?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLElement>
}

type ModalTriggerProps<T extends Record<string, unknown>> =
  | (BaseModalTriggerProps<T> & {
      modalType?: "modal"
      modalKey: Keys.TModalKeys
    })
  | (BaseModalTriggerProps<T> & {
      modalType: "sheet"
      modalKey: Keys.TSheetKeys
    })

export function ModalTrigger<T extends Record<string, unknown>>({
  modalKey,
  className,
  modalType = "modal",
  data,
  initiatorName,
  children,
  asChild = true,
  disabled = false,
  onClick,
}: ModalTriggerProps<T>) {
  const { open } = useModalContext()

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    if (disabled) return

    onClick?.(event)

    if (event.defaultPrevented) return

    if (modalType === "sheet") {
      open({
        key: modalKey as Keys.TSheetKeys,
        data,
        initiatorName,
        type: "sheet",
      })
    } else {
      open({
        key: modalKey as Keys.TModalKeys,
        data,
        initiatorName,
        type: "modal",
      })
    }
  }

  const Comp = asChild ? Slot.Root : Button

  return (
    <Comp
      className={cn(className)}
      type={!asChild ? "button" : undefined}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </Comp>
  )
}
