"use client"

import { TSheetValues } from "@/types/types"
import { SheetComponent } from "./sheet-component"

export default function SheetRoot({
  data,
}: {
  data: Record<Keys.TSheetKeys, TSheetValues<object>>
}) {
  const entries = Object.entries(data) as Array<[Keys.TSheetKeys, TSheetValues]>

  return (
    <>
      {entries.map(([key, sheet]) => {
        const SheetContent = sheet.component

        return (
          <SheetComponent
            key={key}
            sheetKey={key}
            title={sheet.title}
            side={sheet.side}
            showCloseButton={sheet.showCloseButton}
            contentClassName={sheet.contentClassName}
          >
            {(props) => <SheetContent {...props} />}
          </SheetComponent>
        )
      })}
    </>
  )
}
