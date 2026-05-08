import type { TModalKeys as ModalKeys } from "@/components/modals/data"
import type { TSheetKeys as SheetKeys } from "@/components/sheets/data"

declare global {
  namespace Keys {
    type TModalKeys = ModalKeys
    type TSheetKeys = SheetKeys
  }
}

export {}
