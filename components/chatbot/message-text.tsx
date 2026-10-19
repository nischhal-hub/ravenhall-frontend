"use client"

import { Fragment } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { isAllowedRoute } from "@/lib/chatbot/routes"

// [Label](/path) — the only markup the assistant is allowed to use.
const LINK = /\[([^\]\n]{1,60})\]\((\/[^)\s]*)\)/g
// A link that is still streaming in, e.g. "[Member" or "[Membership](/mem".
const PARTIAL_LINK_AT_END = /\[[^\]\n]*(\]\([^)\n]*)?$/

type Props = {
  text: string
  /** Called after a link button navigates (used to close the panel on phones). */
  onNavigate?: () => void
}

/**
 * Renders assistant text, turning [Label](/path) into a button that goes to
 * that page. Only paths on the site's allowed list become buttons; anything
 * else (including external URLs) is shown as its plain label.
 */
export function MessageText({ text, onNavigate }: Props) {
  const router = useRouter()

  const visible = text.replace(PARTIAL_LINK_AT_END, "")
  const nodes: React.ReactNode[] = []
  let last = 0

  for (const match of visible.matchAll(LINK)) {
    const [whole, label, path] = match
    const index = match.index ?? 0
    if (index > last) nodes.push(visible.slice(last, index))

    const base = path.split(/[?#]/)[0]
    if (isAllowedRoute(base)) {
      nodes.push(
        <button
          key={index}
          type="button"
          onClick={() => {
            router.push(path)
            onNavigate?.()
          }}
          className="my-1 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {label}
          <ArrowRight className="size-3" />
        </button>
      )
    } else {
      nodes.push(label)
    }
    last = index + whole.length
  }
  if (last < visible.length) nodes.push(visible.slice(last))

  return (
    <>
      {nodes.map((node, i) => (
        <Fragment key={i}>{node}</Fragment>
      ))}
    </>
  )
}
