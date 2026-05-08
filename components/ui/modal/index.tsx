"use client"

import { TModalValues } from "@/types/types"
import { ModalComponent } from "./modal-component"

export default function ModalRoot({
  data,
}: {
  data: Record<Keys.TModalKeys, TModalValues<object>>
}) {
  const entries = Object.entries(data) as Array<[Keys.TModalKeys, TModalValues]>

  return (
    <>
      {entries.map(([key, modal]) => {
        const ModalContent = modal.component

        return (
          <ModalComponent key={key} modalKey={key} title={modal.title}>
            {(props) => <ModalContent {...props} />}
          </ModalComponent>
        )
      })}
    </>
  )
}
