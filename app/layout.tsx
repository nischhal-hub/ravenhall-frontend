import { Geist, Geist_Mono, DM_Sans } from "next/font/google"

import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

//@ts-ignore
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import ModalRoot from "@/components/ui/modal"
import { MODAL_DATA } from "@/components/modals/data"

import { ModalProvider } from "@/components/context/modal-context"
import { Toaster } from "@/components/ui/sonner"
const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
        geistHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <ModalProvider>
              <Toaster position="top-right" />
              <TooltipProvider>{children}</TooltipProvider>
              <ModalRoot data={MODAL_DATA} />
              {/* <SheetRoot data={SHEET_DATA} /> */}
            </ModalProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
