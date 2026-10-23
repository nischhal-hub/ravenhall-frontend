"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai"
import { Bot, Loader2, MessageCircle, RotateCcw, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  BookingProposalCard,
  CancelProposalCard,
} from "@/components/chatbot/proposal-cards"
import {
  getAvailability,
  getMembershipPlans,
  getMyBookings,
  getMyMembership,
  navigateTo,
  searchLanes,
} from "@/components/chatbot/tool-handlers"
import { MessageText } from "@/components/chatbot/message-text"
import type { chatTools } from "@/lib/chatbot/tools"
import { cn } from "@/lib/utils"
import { useMeQuery } from "@/services/queries/auth"

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  InferUITools<typeof chatTools>
>

// Page / user context sent with every request. Module-level because there is
// a single assistant instance and the transport below is created once.
const chatContext: { pathname?: string; userName?: string } = {}

const transport = new DefaultChatTransport({
  api: "/api/chat",
  body: () => ({ ...chatContext }),
})

const SUGGESTIONS = [
  "What lanes do you have?",
  "Any batting lane free tomorrow evening?",
  "Explain the membership plans",
  "Show my bookings",
]

const TOOL_STATUS: Record<string, string> = {
  searchLanes: "Looking up lanes…",
  getAvailability: "Checking availability…",
  getMembershipPlans: "Looking up memberships…",
  getMyMembership: "Checking your membership…",
  getMyBookings: "Fetching your bookings…",
  navigate: "Opening page…",
}

// The assistant is not shown on the login / register screens.
const HIDDEN_ON = ["/auth"]

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong."
}

export function Chatbot() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: user } = useMeQuery()

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatContext.pathname = pathname
    chatContext.userName = user?.firstName
  }, [pathname, user?.firstName])

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
    regenerate,
    setMessages,
  } = useChat<ChatMessage>({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    // Data tools and navigation run here, in the browser, as the customer.
    // propose* tools are answered by the cards below, not here.
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
      const { toolCallId } = toolCall

      const run = (
        tool: keyof typeof TOOL_STATUS,
        fn: () => Promise<unknown> | unknown
      ) => {
        // Not awaited on purpose: awaiting inside onToolCall can deadlock the chat.
        void (async () => {
          try {
            const output = await fn()
            addToolOutput({
              tool: tool as never,
              toolCallId,
              output: output as never,
            })
          } catch (err) {
            addToolOutput({
              tool: tool as never,
              toolCallId,
              state: "output-error",
              errorText: errorMessage(err),
            })
          }
        })()
      }

      switch (toolCall.toolName) {
        case "searchLanes":
          return run("searchLanes", () => searchLanes(toolCall.input))
        case "getAvailability":
          return run("getAvailability", () => getAvailability(toolCall.input))
        case "getMembershipPlans":
          return run("getMembershipPlans", () => getMembershipPlans())
        case "getMyMembership":
          return run("getMyMembership", () => getMyMembership())
        case "getMyBookings":
          return run("getMyBookings", () => getMyBookings())
        case "navigate":
          return run("navigate", () => {
            const result = navigateTo(toolCall.input.path, router.push)
            if (result.ok) closeOnSmallScreens()
            return result
          })
      }
    },
  })

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, status, open])

  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null
  }

  function closeOnSmallScreens() {
    if (window.innerWidth < 640) setOpen(false)
  }

  function send(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput("")
  }

  if (!open) {
    return (
      <Button
        aria-label="Open Ravenhall assistant"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-5 z-50 h-12 rounded-full px-5 shadow-lg sm:right-8 sm:bottom-8"
      >
        <MessageCircle className="size-4" />
        Ask Ravenhall
      </Button>
    )
  }

  return (
    <section
      aria-label="Ravenhall assistant"
      className="fixed inset-x-3 bottom-3 z-50 flex h-[min(640px,calc(100svh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-2xl sm:inset-x-auto sm:right-8 sm:bottom-8 sm:w-[400px]"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <Bot className="size-5" />
          <div>
            <p className="text-sm leading-none font-semibold">
              Ravenhall Assistant
            </p>
            <p className="mt-1 text-[11px] opacity-70">
              Bookings, lanes &amp; memberships
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Start a new chat"
              className="size-8 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMessages([])}
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close assistant"
            className="size-8 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="rounded-2xl bg-muted px-3 py-2 text-sm">
              Hi{user?.firstName ? ` ${user.firstName}` : ""}! I can find free
              lanes, help you book, explain memberships and show you around the
              site. What would you like to do?
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-left text-xs transition hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col gap-1.5",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            {message.parts.map((part, i) => {
              const key = `${message.id}-${i}`

              if (part.type === "text") {
                if (!part.text) return null
                return (
                  <div
                    key={key}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "user" ? (
                      part.text
                    ) : (
                      <MessageText
                        text={part.text}
                        onNavigate={closeOnSmallScreens}
                      />
                    )}
                  </div>
                )
              }

              if (part.type === "tool-proposeBooking") {
                if (part.state === "input-streaming" || !part.input) return null
                return (
                  <div key={key} className="w-full max-w-[92%]">
                    <BookingProposalCard
                      {...part.input}
                      doneResult={
                        part.state === "output-available"
                          ? String(part.output)
                          : undefined
                      }
                      onDone={(output) => {
                        closeOnSmallScreens()
                        addToolOutput({
                          tool: "proposeBooking",
                          toolCallId: part.toolCallId,
                          output,
                        })
                      }}
                    />
                  </div>
                )
              }

              if (part.type === "tool-proposeCancelBooking") {
                if (part.state === "input-streaming" || !part.input) return null
                return (
                  <div key={key} className="w-full max-w-[92%]">
                    <CancelProposalCard
                      bookingId={part.input.bookingId}
                      doneResult={
                        part.state === "output-available"
                          ? String(part.output)
                          : undefined
                      }
                      onDone={(output) =>
                        addToolOutput({
                          tool: "proposeCancelBooking",
                          toolCallId: part.toolCallId,
                          output,
                        })
                      }
                    />
                  </div>
                )
              }

              // Data tools: show a small status line only while they run.
              if (part.type.startsWith("tool-")) {
                const name = part.type.slice("tool-".length)
                const state = (part as { state: string }).state
                if (
                  state === "input-available" ||
                  state === "input-streaming"
                ) {
                  return (
                    <p
                      key={key}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <Loader2 className="size-3 animate-spin" />
                      {TOOL_STATUS[name] ?? "Working…"}
                    </p>
                  )
                }
              }

              return null
            })}
          </div>
        ))}

        {status === "submitted" && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Thinking…
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
            <p>Sorry, I couldn&apos;t answer that. Please try again.</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => regenerate()}
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      <form
        className="flex items-end gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder="Ask about lanes, bookings…"
          rows={1}
          maxLength={1000}
          className="max-h-28 min-h-9 resize-none text-sm"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={busy || !input.trim()}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </section>
  )
}
