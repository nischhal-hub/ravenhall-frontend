import type { FC } from "react"
import ExampleSheet from "./example-sheet"
import { _ModalProps } from "@/types/types"

export type TSheetKeys = "EXAMPLE_SHEET"

export type TSheetValues<T extends object = object> = {
  title: string
  component: FC<_ModalProps<T>>
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  contentClassName?: string
}

export const SHEET_DATA: Record<TSheetKeys, TSheetValues> = {
  EXAMPLE_SHEET: {
    title: "Example Sheet",
    component: ExampleSheet,
  },
}
