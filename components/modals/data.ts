import type { FC } from "react"
import type { _ModalProps } from "@workspace/ui/types/types"
import WelcomeScreen from "./welcome-screen"

export type TModalKeys = "WELCOME_USERS"

export type TModalValues<T extends object = {}> = {
  title: string
  component: FC<_ModalProps<T>>
}

export const MODAL_DATA: Record<TModalKeys, TModalValues> = {
  WELCOME_USERS: {
    title: "Welcome",
    component: WelcomeScreen,
  },
}
