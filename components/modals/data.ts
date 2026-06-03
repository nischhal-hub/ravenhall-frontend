import type { FC } from "react"
import CreateDiscountCodeForm from "./discount/add-discount"
import EditDiscount from "./discount/edit-discount"
import DeleteModal from "./delete-modal"
import AddLaneForm from "./lane/add-lane"
import EditLane from "./lane/edit-lane"
import CreateBookingForm from "./booking/add-booking"
import UpdateBookingStatus from "./booking/edit-status"
import { _ModalProps } from "@/types/types"

export type TModalKeys =
  | "DELETE_ITEM"
  | "WELCOME_USERS"
  | "ADD_DISCOUNT"
  | "EDIT_DISCOUNT"
  | "ADD_LANE"
  | "EDIT_LANE"
  | "ADD_BOOKING"
  | "EDIT_BOOKING_STATUS"

export type TModalValues<T extends object = object> = {
  title: string
  component: FC<_ModalProps<T>>
}

export const MODAL_DATA: Record<TModalKeys, TModalValues> = {
  DELETE_ITEM: {
    title: "Delete Item",
    // @ts-expect-error component type not properly defined
    component: DeleteModal,
  },
  ADD_DISCOUNT: {
    title: "Add Discount",
    component: CreateDiscountCodeForm,
  },
  EDIT_DISCOUNT: {
    title: "Edit Discount",
    // @ts-expect-error component type not properly defined
    component: EditDiscount,
  },
  ADD_LANE: {
    title: "Add Lane",
    component: AddLaneForm,
  },
  EDIT_LANE: {
    title: "Edit Lane",
    // @ts-expect-error component type not properly defined
    component: EditLane,
  },
  ADD_BOOKING: {
    title: "Add Booking",
    component: CreateBookingForm,
  },
  EDIT_BOOKING_STATUS: {
    title: "Edit Booking Status",
    // @ts-expect-error component type not properly defined
    component: UpdateBookingStatus,
  },
}
