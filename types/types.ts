export type _ModalProps<T extends object = object> = {
  data?: T
  initiatorName?: string
  close: () => void
}

export type TModalValues<T extends object = object> = {
  title: string
  component: React.FC<_ModalProps<T>>
}

export type TSheetValues<T extends object = object> = {
  title: string
  component: React.FC<_ModalProps<T>>
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  contentClassName?: string
}
