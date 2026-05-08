"use client"
import { createContext, useContext, useState } from "react"

type TModalState = {
  [key in Keys.TModalKeys | Keys.TSheetKeys]: {
    open: boolean
    data?: object
    initiatorName?: string
    type?: "modal" | "sheet"
  }
}

type CommonOpenParams<T> = {
  data?: T
  initiatorName?: string
}

type TOpenParams<T extends Record<string, unknown>> = CommonOpenParams<T> &
  (
    | {
        key: Keys.TModalKeys
        type: "modal"
      }
    | {
        key: Keys.TSheetKeys
        type: "sheet"
      }
  )

type TModalContext = {
  open: <T extends Record<string, unknown>>(params: TOpenParams<T>) => void
  close: (key: Keys.TModalKeys | Keys.TSheetKeys) => void
  modals: TModalState
}

const ModalContext = createContext<TModalContext | null>(null)
export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [modals, setModals] = useState<TModalState>({} as TModalState)
  const open = <T extends Record<string, unknown>>(params: TOpenParams<T>) => {
    setModals((prev) => ({
      ...prev,
      [params.key]: {
        open: true,
        data: params.data,
        initiatorName: params.initiatorName,
        type: params.type,
      },
    }))
  }

  const close = (key: Keys.TModalKeys | Keys.TSheetKeys) => {
    setModals((prev) => ({
      ...prev,
      [key]: {
        open: false,
        initiatorName: undefined,
        data: undefined,
      },
    }))
  }

  return (
    <ModalContext.Provider value={{ open, close, modals }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalContextProvider")
  }
  return context
}
