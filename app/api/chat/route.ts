import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

import { chatTools } from "@/lib/chatbot/tools"
import { buildSystemPrompt } from "@/lib/chatbot/system-prompt"

export const maxDuration = 30

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash"
const THINKING_LEVEL = (process.env.GEMINI_THINKING_LEVEL || "low") as
  | "minimal"
  | "low"
  | "medium"
  | "high"
const CENTRE_TIMEZONE = process.env.CENTRE_TIMEZONE || "Australia/Perth"

// Cost / abuse guards. The route is public (guests can ask questions), so the
// Gemini key must not be usable as an open proxy.
const MAX_MESSAGES = 30
const MAX_TEXT_LENGTH = 1000
// Each tool round trip is another request, so this is per request, not per question.
const RATE_LIMIT = { windowMs: 60_000, max: 40 }

const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs })
    if (hits.size > 5000) {
      for (const [key, value] of hits) {
        if (value.resetAt <= now) hits.delete(key)
      }
    }
    return false
  }

  entry.count += 1
  return entry.count > RATE_LIMIT.max
}

function centreToday() {
  const now = new Date()
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CENTRE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  const weekday = new Intl.DateTimeFormat("en-AU", {
    timeZone: CENTRE_TIMEZONE,
    weekday: "long",
  }).format(now)

  return { today: `${get("year")}-${get("month")}-${get("day")}`, weekday }
}

function json(body: { error: string }, status: number) {
  return Response.json(body, { status })
}

function isTooLong(messages: UIMessage[]) {
  return messages.some(
    (m) =>
      m.role === "user" &&
      m.parts.some((p) => p.type === "text" && p.text.length > MAX_TEXT_LENGTH)
  )
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return json({ error: "The assistant is not configured." }, 503)
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (rateLimited(ip)) {
    return json({ error: "Too many requests. Please slow down." }, 429)
  }

  let body: {
    messages?: UIMessage[]
    pathname?: string
    userName?: string
  }
  try {
    body = await req.json()
  } catch {
    return json({ error: "Invalid request." }, 400)
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return json({ error: "Invalid request." }, 400)
  }
  if (isTooLong(body.messages)) {
    return json({ error: "Message too long." }, 413)
  }

  // Whole UI messages are kept together, so tool calls stay paired with
  // their results when the history is trimmed.
  const messages = body.messages.slice(-MAX_MESSAGES)

  const result = streamText({
    model: google(MODEL),
    system: buildSystemPrompt({
      ...centreToday(),
      pathname:
        typeof body.pathname === "string"
          ? body.pathname.slice(0, 200)
          : undefined,
      userName:
        typeof body.userName === "string"
          ? body.userName.slice(0, 80)
          : undefined,
    }),
    messages: await convertToModelMessages(messages, { tools: chatTools }),
    tools: chatTools,
    // Gemini 3 thinks before answering by default, which adds seconds to
    // every turn. This is a lookup / booking helper, not a reasoning task.
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: THINKING_LEVEL } },
    },
  })

  return result.toUIMessageStreamResponse({
    // The default message hides everything. Log the real cause (bad key, retired
    // model, quota...) to the server logs, but keep the client message generic.
    onError: (error) => {
      console.error(`[chat] model "${MODEL}" failed:`, error)
      return "The assistant is unavailable right now. Please try again."
    },
  })
}
