import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function QuickBookFab() {
  return (
    <div className="fixed right-4 bottom-5 z-40 sm:right-8 sm:bottom-8">
      <Link href={"/lanes"} className="block">
        <Button
          className="h-11 rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground shadow-[0_24px_48px_-12px_rgba(25,28,30,0.25)] hover:bg-accent/90"
          size="lg"
        >
          <PlusCircle className="size-4" />
          Quick Book
        </Button>
      </Link>
    </div>
  )
}
