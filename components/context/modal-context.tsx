"use client"
import { createContext, useContext, useState } from "react"
import { TModalKeys } from "../modals/data"

type TModalState = {
  [key in TModalKeys]: {
    type: string
    open: boolean
    initiatorName?: string
    data?: unknown
  }
}
type TModalContext = {
  modals: TModalState
  openModal: ({
    key,
    initiatorName,
    data,
  }: {
    key: TModalKeys
    initiatorName?: string
    data?: unknown
  }) => void
  closeModal: (key: TModalKeys) => void
}

export const ModalContext = createContext<TModalContext | null>(null)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<TModalState>({} as TModalState)

  const openModal = ({
    key,
    initiatorName,
    data,
  }: {
    key: TModalKeys
    initiatorName?: string
    data?: unknown
  }) => {
    setModals((prev) => ({
      ...prev,
      [key]: {
        open: true,
        initiatorName,
        data,
      },
    }))
  }

  const closeModal = (key: TModalKeys) => {
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
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
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
