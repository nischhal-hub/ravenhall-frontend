import { Discount } from "./discount-response.types"

export type _ModalProps<T extends object = object> = {
  data?: T
  initiatorName?: string
  closeModal: () => void
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

export interface TModalDataMap {
  DELETE_ITEM: {
    type: TDeleteItem["type"]
  }
  LOGOUT: null
  EDIT_DISCOUNT: Discount
}
