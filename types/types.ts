import { TDeleteItem } from "@/services/mutations/delete.mutations"
import { Discount } from "./discount-response.types"
import { Lane } from "./lane-response.types"
import { Booking } from "./booking-response.types"

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
  EDIT_LANE: Lane
  EDIT_BOOKING_STATUS: Booking
  ADD_BOOKING: Booking
}
