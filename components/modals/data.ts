import type { FC } from "react"
import type { _ModalProps } from "@workspace/ui/types/types"
import WelcomeScreen from "./welcome-screen"
import CreateDiscountCodeForm from "./discount/add-discount"
import EditDiscount from "./discount/edit-discount"
import DeleteModal from "./delete-modal"

export type TModalKeys = "DELETE_ITEM"|"WELCOME_USERS" | "ADD_DISCOUNT" | "EDIT_DISCOUNT"

export type TModalValues<T extends object = {}> = {
  title: string
  component: FC<_ModalProps<T>>
}

export const MODAL_DATA: Record<TModalKeys, TModalValues> = {
  DELETE_ITEM: {
    title: "Delete Item",
    component: DeleteModal,
  },
  WELCOME_USERS: {
    title: "Welcome",
    component: WelcomeScreen,
  },
  ADD_DISCOUNT: {
    title: "Add Discount",
    component: CreateDiscountCodeForm,
  },
  EDIT_DISCOUNT: {
    title: "Edit Discount",
    component: EditDiscount,
  },
}
