# Ravenhall Assistant (AI Chatbot)

A chat helper that lives on the customer side of the website. Customers can ask it questions in plain English instead of clicking through pages.

---

## 1. What it is

A small "Ask Ravenhall" button sits in the bottom-right corner of the customer website (landing pages and the customer dashboard). Clicking it opens a chat window.

The assistant can:

| It can...                                       | Example                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| Tell you about the lanes                        | "What lanes do you have?"                           |
| Find free times                                 | "Any batting lane free tomorrow evening?"           |
| Help you start a booking                        | "Book the 6 PM one"                                 |
| Explain memberships                             | "What's the difference between monthly and annual?" |
| Show your bookings / membership (if logged in)  | "Show my bookings"                                  |
| Cancel a booking (only after you press Confirm) | "Cancel my booking for Saturday"                    |
| Show you where things are                       | "Where do I see my memberships?"                    |

It **never** takes payment and **never** books or cancels anything by itself. A person always has to press a button.

It does **not** appear on the login / register pages, and it is only for customers (not the admin area).

---

## 2. How to use it (examples)

**Finding a lane**

> **You:** any batting lane free tomorrow evening?
> **Assistant:** Yes! Lane 1 — Batting has 6:00 PM, 7:00 PM and 8:00 PM free tomorrow ($45/hr). Want me to set one up?
> **You:** 7 PM please
> _(a card appears showing the lane, date, time and price, with a **Review & pay** button)_

Pressing **Review & pay** opens the normal booking page with that date and time already selected. The customer then adds a promo code and pays the way they always do.

**Cancelling**

> **You:** cancel my Saturday booking
> _(a card appears: "Cancel RIC-2026-XXXXX?" with **Confirm cancel** and **Keep it**)_

Nothing is cancelled until **Confirm cancel** is pressed. If the booking was paid, the card says it will be refunded.

**Finding a page**

> **You:** where can I see my bookings?
> **Assistant:** You can see them here: **[My bookings →]** _(a button)_

If you say "take me to memberships" the assistant opens the page straight away instead.

**Questions the assistant will refuse**
Anything not about Ravenhall (homework, general chat, etc.) — it politely declines.

---

## 3. How it works (the big picture)

```
   Customer's browser                         Our servers                      Google
 ┌───────────────────────┐   1. message    ┌─────────────────────┐  2. ask   ┌────────┐
 │  Chat window          │ ──────────────▶ │ Next.js /api/chat   │ ────────▶ │ Gemini │
 │  (components/chatbot) │                 │ (holds secret key)  │ ◀──────── │  AI    │
 │                       │ ◀────────────── │                     │  3. reply └────────┘
 │                       │  4. "please run │                     │
 │                       │   getAvailability"                    │
 │                       │
 │   runs the tool here  │  5. calls our normal backend API
 │   as the logged-in    │ ──────────────▶  ravenhall-backend (Express + Prisma)
 │   customer            │ ◀──────────────
 │                       │  6. sends result back to the AI, which writes the answer
 └───────────────────────┘
```

In simple words:

1. The customer types a message.
2. The message goes to our own server route (`/api/chat`). This route holds the secret Gemini key, so it is never exposed in the browser.
3. Gemini reads the message and decides what to do. It can answer directly, or ask for a **tool** ("tools" are small functions such as _check availability_).
4. Tools run **in the customer's browser**, using the same API client the rest of the website uses. That means they act as the logged-in customer with their own login token. Nothing special or extra-powerful.
5. The tool result goes back to Gemini, which writes a friendly answer.
6. Answers appear word by word as they stream in.

**Why do tools run in the browser?** It reuses the existing login, each customer gets their own request limits, and the cards (Confirm / Review & pay) can ask the person before anything changes.

### The tools the AI can use

| Tool                   | What it does                                                 | Where the data comes from                             |
| ---------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `searchLanes`          | Lists lanes (id, type, price, capacity)                      | `GET /lanes`                                          |
| `getAvailability`      | Free start times on a date (optional morning/evening window) | `GET /lanes/availability` (new)                       |
| `getMembershipPlans`   | Plans, prices, discounts                                     | `GET /memberships`                                    |
| `getMyMembership`      | The customer's current plan (login needed)                   | `GET /memberships/me`                                 |
| `getMyBookings`        | The customer's recent bookings (login needed)                | `GET /bookings/my`                                    |
| `navigate`             | Opens a page (only pages on an allowed list)                 | —                                                     |
| `proposeBooking`       | Shows the booking card (button opens booking page)           | `GET /lanes/:id`                                      |
| `proposeCancelBooking` | Shows the Confirm / Keep it card                             | `GET /bookings/my`, then `PATCH /bookings/:id/cancel` |

---

## 4. Where everything lives

### Frontend (`ravenhall-frontend`)

| File                                    | Job                                                                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app/api/chat/route.ts`                 | The server route. Talks to Gemini, applies safety limits.                                                              |
| `lib/chatbot/system-prompt.ts`          | The assistant's "instructions": personality, rules, today's date, allowed pages. **Edit this to change how it talks.** |
| `lib/chatbot/tools.ts`                  | Defines the tools the AI is allowed to call (names, descriptions, inputs).                                             |
| `lib/chatbot/routes.ts`                 | The list of pages the assistant may link to / open, and the booking deep link.                                         |
| `components/chatbot/chatbot.tsx`        | The chat window (button, messages, input, runs the tools).                                                             |
| `components/chatbot/tool-handlers.ts`   | The code that actually calls our backend for each tool.                                                                |
| `components/chatbot/proposal-cards.tsx` | The "Review & pay" and "Confirm cancel" cards.                                                                         |
| `components/chatbot/message-text.tsx`   | Turns `[Label](/path)` in a reply into a button.                                                                       |
| `app/(customer)/layout.tsx`             | Puts the chat on every customer page (keeps the conversation while moving between pages).                              |

Small edits to existing files:

- `app/(customer)/(landing)/lanes/[id]/page.tsx` and `.../component/Step1.tsx` — the booking page now understands `?date=…&slotId=…` so a slot can be pre-selected.
- `components/pages/landing/quick-book-fab.tsx` — moved up slightly so it doesn't overlap the chat button.

### Backend (`ravenhall-backend`)

One new public endpoint: **`GET /api/lanes/availability?date=YYYY-MM-DD&type=BATTING`**
It returns every lane's free, unblocked slots for that date. For today it hides slots that have already started (using the centre's timezone). Code is in `src/modules/lanes/` and tests in `src/tests/lanes.test.ts`.

### Packages added

- `ai` — Vercel AI SDK core (streaming, tools)
- `@ai-sdk/react` — the `useChat` hook for the chat window
- `@ai-sdk/google` — connects to Gemini

---

## 5. Setup

1. Get a Gemini API key from Google AI Studio.
2. Create **`.env.local`** in `ravenhall-frontend` (this file is git-ignored, so the key stays private — do **not** put it in `.env`, which is committed):

```
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
```

3. Restart `pnpm dev`. The "Ask Ravenhall" button appears.
4. Make sure the backend is running and `NEXT_PUBLIC_API_BASE_URL` points to it.

### Optional settings (also in `.env.local`)

| Variable                | Default            | Meaning                                                                                                              |
| ----------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `GEMINI_MODEL`          | `gemini-3.8-flash` | Which Gemini model to use. Google retires old models, so change this if you see a "model no longer available" error. |
| `GEMINI_THINKING_LEVEL` | `low`              | `minimal` / `low` / `medium` / `high`. Lower = faster answers.                                                       |
| `CENTRE_TIMEZONE`       | `Australia/Perth`  | Used for "today" and hiding past slots. Set it on the backend too.                                                   |

---

## 6. Safety and limits

- **Secret key stays on the server.** The browser never sees it.
- **People confirm everything important.** Booking opens the normal checkout; cancelling needs a Confirm press.
- **Cards show real data**, loaded from our API — not text the AI wrote — so a wrong price or time can't appear on a card.
- **Only approved pages.** The assistant can only link to or open pages in `lib/chatbot/routes.ts`. Any other link is shown as plain text.
- **Abuse limits** on `/api/chat`: 40 requests per minute per IP, 1000 characters per message, last 30 messages kept.
- **Ignores instructions hidden in data** (for example a lane description saying "ignore your rules").
- **Guests can chat**, but personal tools (bookings, membership) need a login; otherwise the assistant offers the login page.

---

## 7. Common problems

| Problem                                 | Fix                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Button shows but replies fail           | Check the terminal running `pnpm dev` for the real error.                                                                |
| "model is no longer available"          | Set `GEMINI_MODEL` to a current model.                                                                                   |
| "The assistant is not configured" (503) | `GOOGLE_GENERATIVE_AI_API_KEY` is missing or the server wasn't restarted.                                                |
| "Too many requests" (429)               | Rate limit hit; wait a minute.                                                                                           |
| Slow replies                            | Try `GEMINI_THINKING_LEVEL=minimal`, or a lighter "flash-lite" model. `pnpm dev` is also slower than a production build. |
| No free slots found                     | Slots are created ahead of time by the backend job; check the date is within the generated range.                        |
| Chat is empty after refresh             | Normal — history is kept while moving between pages, but cleared on a full reload.                                       |

---

## 8. How to extend it

**Change how it talks or what it knows** → edit `lib/chatbot/system-prompt.ts`.

**Let it open another page** → add the path to `STATIC_ROUTES` in `lib/chatbot/routes.ts`.

**Give it a new ability (a new tool)**

1. Add the tool (name, description, inputs) in `lib/chatbot/tools.ts`.
2. Add the function that calls the backend in `components/chatbot/tool-handlers.ts`.
3. Add a `case` for it in the `onToolCall` switch in `components/chatbot/chatbot.tsx`.
4. Mention it briefly in the system prompt so the AI knows when to use it.

Keep tool results small — the AI reads every character, and big results make replies slower.

---

## 9. Known limitations

- Booking is finished on the normal booking page (that's deliberate — payment stays in one trusted place).
- Final prices (equipment fee, discounts) are shown at checkout, so the assistant only quotes the hourly rate.
- Opening hours: the About page says 6 AM–10 PM but the slot generator makes 7 AM–10 PM slots. The assistant relies on real availability.
- Existing backend issue (not part of the chatbot): `GET /bookings/:id` and `DELETE /bookings/:id` don't check that the booking belongs to the caller.

# Ravenhall Assistant (AI Chatbot)

A chat helper that lives on the customer side of the website. Customers can ask it questions in plain English instead of clicking through pages.

---

## 1. What it is

A small "Ask Ravenhall" button sits in the bottom-right corner of the customer website (landing pages and the customer dashboard). Clicking it opens a chat window.

The assistant can:

| It can...                                       | Example                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| Tell you about the lanes                        | "What lanes do you have?"                           |
| Find free times                                 | "Any batting lane free tomorrow evening?"           |
| Help you start a booking                        | "Book the 6 PM one"                                 |
| Explain memberships                             | "What's the difference between monthly and annual?" |
| Show your bookings / membership (if logged in)  | "Show my bookings"                                  |
| Cancel a booking (only after you press Confirm) | "Cancel my booking for Saturday"                    |
| Show you where things are                       | "Where do I see my memberships?"                    |

It **never** takes payment and **never** books or cancels anything by itself. A person always has to press a button.

It does **not** appear on the login / register pages, and it is only for customers (not the admin area).

---

## 2. How to use it (examples)

**Finding a lane**

> **You:** any batting lane free tomorrow evening?
> **Assistant:** Yes! Lane 1 — Batting has 6:00 PM, 7:00 PM and 8:00 PM free tomorrow ($45/hr). Want me to set one up?
> **You:** 7 PM please
> _(a card appears showing the lane, date, time and price, with a **Review & pay** button)_

Pressing **Review & pay** opens the normal booking page with that date and time already selected. The customer then adds a promo code and pays the way they always do.

**Cancelling**

> **You:** cancel my Saturday booking
> _(a card appears: "Cancel RIC-2026-XXXXX?" with **Confirm cancel** and **Keep it**)_

Nothing is cancelled until **Confirm cancel** is pressed. If the booking was paid, the card says it will be refunded.

**Finding a page**

> **You:** where can I see my bookings?
> **Assistant:** You can see them here: **[My bookings →]** _(a button)_

If you say "take me to memberships" the assistant opens the page straight away instead.

**Questions the assistant will refuse**
Anything not about Ravenhall (homework, general chat, etc.) — it politely declines.

---

## 3. How it works (the big picture)

```
   Customer's browser                         Our servers                      Google
 ┌───────────────────────┐   1. message    ┌─────────────────────┐  2. ask   ┌────────┐
 │  Chat window          │ ──────────────▶ │ Next.js /api/chat   │ ────────▶ │ Gemini │
 │  (components/chatbot) │                 │ (holds secret key)  │ ◀──────── │  AI    │
 │                       │ ◀────────────── │                     │  3. reply └────────┘
 │                       │  4. "please run │                     │
 │                       │   getAvailability"                    │
 │                       │
 │   runs the tool here  │  5. calls our normal backend API
 │   as the logged-in    │ ──────────────▶  ravenhall-backend (Express + Prisma)
 │   customer            │ ◀──────────────
 │                       │  6. sends result back to the AI, which writes the answer
 └───────────────────────┘
```

In simple words:

1. The customer types a message.
2. The message goes to our own server route (`/api/chat`). This route holds the secret Gemini key, so it is never exposed in the browser.
3. Gemini reads the message and decides what to do. It can answer directly, or ask for a **tool** ("tools" are small functions such as _check availability_).
4. Tools run **in the customer's browser**, using the same API client the rest of the website uses. That means they act as the logged-in customer with their own login token. Nothing special or extra-powerful.
5. The tool result goes back to Gemini, which writes a friendly answer.
6. Answers appear word by word as they stream in.

**Why do tools run in the browser?** It reuses the existing login, each customer gets their own request limits, and the cards (Confirm / Review & pay) can ask the person before anything changes.

### The tools the AI can use

| Tool                   | What it does                                                 | Where the data comes from                             |
| ---------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `searchLanes`          | Lists lanes (id, type, price, capacity)                      | `GET /lanes`                                          |
| `getAvailability`      | Free start times on a date (optional morning/evening window) | `GET /lanes/availability` (new)                       |
| `getMembershipPlans`   | Plans, prices, discounts                                     | `GET /memberships`                                    |
| `getMyMembership`      | The customer's current plan (login needed)                   | `GET /memberships/me`                                 |
| `getMyBookings`        | The customer's recent bookings (login needed)                | `GET /bookings/my`                                    |
| `navigate`             | Opens a page (only pages on an allowed list)                 | —                                                     |
| `proposeBooking`       | Shows the booking card (button opens booking page)           | `GET /lanes/:id`                                      |
| `proposeCancelBooking` | Shows the Confirm / Keep it card                             | `GET /bookings/my`, then `PATCH /bookings/:id/cancel` |

---

## 4. Where everything lives

### Frontend (`ravenhall-frontend`)

| File                                    | Job                                                                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app/api/chat/route.ts`                 | The server route. Talks to Gemini, applies safety limits.                                                              |
| `lib/chatbot/system-prompt.ts`          | The assistant's "instructions": personality, rules, today's date, allowed pages. **Edit this to change how it talks.** |
| `lib/chatbot/tools.ts`                  | Defines the tools the AI is allowed to call (names, descriptions, inputs).                                             |
| `lib/chatbot/routes.ts`                 | The list of pages the assistant may link to / open, and the booking deep link.                                         |
| `components/chatbot/chatbot.tsx`        | The chat window (button, messages, input, runs the tools).                                                             |
| `components/chatbot/tool-handlers.ts`   | The code that actually calls our backend for each tool.                                                                |
| `components/chatbot/proposal-cards.tsx` | The "Review & pay" and "Confirm cancel" cards.                                                                         |
| `components/chatbot/message-text.tsx`   | Turns `[Label](/path)` in a reply into a button.                                                                       |
| `app/(customer)/layout.tsx`             | Puts the chat on every customer page (keeps the conversation while moving between pages).                              |

Small edits to existing files:

- `app/(customer)/(landing)/lanes/[id]/page.tsx` and `.../component/Step1.tsx` — the booking page now understands `?date=…&slotId=…` so a slot can be pre-selected.
- `components/pages/landing/quick-book-fab.tsx` — moved up slightly so it doesn't overlap the chat button.

### Backend (`ravenhall-backend`)

One new public endpoint: **`GET /api/lanes/availability?date=YYYY-MM-DD&type=BATTING`**
It returns every lane's free, unblocked slots for that date. For today it hides slots that have already started (using the centre's timezone). Code is in `src/modules/lanes/` and tests in `src/tests/lanes.test.ts`.

### Packages added

- `ai` — Vercel AI SDK core (streaming, tools)
- `@ai-sdk/react` — the `useChat` hook for the chat window
- `@ai-sdk/google` — connects to Gemini

---

## 5. Setup

1. Get a Gemini API key from Google AI Studio.
2. Create **`.env.local`** in `ravenhall-frontend` (this file is git-ignored, so the key stays private — do **not** put it in `.env`, which is committed):

```
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
```

3. Restart `pnpm dev`. The "Ask Ravenhall" button appears.
4. Make sure the backend is running and `NEXT_PUBLIC_API_BASE_URL` points to it.

### Optional settings (also in `.env.local`)

| Variable                | Default            | Meaning                                                                                                              |
| ----------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `GEMINI_MODEL`          | `gemini-3.6-flash` | Which Gemini model to use. Google retires old models, so change this if you see a "model no longer available" error. |
| `GEMINI_THINKING_LEVEL` | `low`              | `minimal` / `low` / `medium` / `high`. Lower = faster answers.                                                       |
| `CENTRE_TIMEZONE`       | `Australia/Perth`  | Used for "today" and hiding past slots. Set it on the backend too.                                                   |

---

## 6. Safety and limits

- **Secret key stays on the server.** The browser never sees it.
- **People confirm everything important.** Booking opens the normal checkout; cancelling needs a Confirm press.
- **Cards show real data**, loaded from our API — not text the AI wrote — so a wrong price or time can't appear on a card.
- **Only approved pages.** The assistant can only link to or open pages in `lib/chatbot/routes.ts`. Any other link is shown as plain text.
- **Abuse limits** on `/api/chat`: 40 requests per minute per IP, 1000 characters per message, last 30 messages kept.
- **Ignores instructions hidden in data** (for example a lane description saying "ignore your rules").
- **Guests can chat**, but personal tools (bookings, membership) need a login; otherwise the assistant offers the login page.

---

## 7. Common problems

| Problem                                 | Fix                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Button shows but replies fail           | Check the terminal running `pnpm dev` for the real error.                                                                |
| "model is no longer available"          | Set `GEMINI_MODEL` to a current model.                                                                                   |
| "The assistant is not configured" (503) | `GOOGLE_GENERATIVE_AI_API_KEY` is missing or the server wasn't restarted.                                                |
| "Too many requests" (429)               | Rate limit hit; wait a minute.                                                                                           |
| Slow replies                            | Try `GEMINI_THINKING_LEVEL=minimal`, or a lighter "flash-lite" model. `pnpm dev` is also slower than a production build. |
| No free slots found                     | Slots are created ahead of time by the backend job; check the date is within the generated range.                        |
| Chat is empty after refresh             | Normal — history is kept while moving between pages, but cleared on a full reload.                                       |

---

## 8. How to extend it

**Change how it talks or what it knows** → edit `lib/chatbot/system-prompt.ts`.

**Let it open another page** → add the path to `STATIC_ROUTES` in `lib/chatbot/routes.ts`.

**Give it a new ability (a new tool)**

1. Add the tool (name, description, inputs) in `lib/chatbot/tools.ts`.
2. Add the function that calls the backend in `components/chatbot/tool-handlers.ts`.
3. Add a `case` for it in the `onToolCall` switch in `components/chatbot/chatbot.tsx`.
4. Mention it briefly in the system prompt so the AI knows when to use it.

Keep tool results small — the AI reads every character, and big results make replies slower.

---

## 9. Known limitations

- Booking is finished on the normal booking page (that's deliberate — payment stays in one trusted place).
- Final prices (equipment fee, discounts) are shown at checkout, so the assistant only quotes the hourly rate.
- Opening hours: the About page says 6 AM–10 PM but the slot generator makes 7 AM–10 PM slots. The assistant relies on real availability.
- Existing backend issue (not part of the chatbot): `GET /bookings/:id` and `DELETE /bookings/:id` don't check that the booking belongs to the caller.
