import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarClock,
  CircleCheck,
  MailCheck,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Benefit = { icon: React.ElementType; title: string; text: string }

const BRAND: Record<
  "customer" | "admin",
  { headline: string; text: string; benefits: Benefit[] }
> = {
  customer: {
    headline: "Book your lane in seconds",
    text: "Batting and bowling lanes at Ravenhall Indoor Cricket Centre, open every day.",
    benefits: [
      {
        icon: CalendarClock,
        title: "Live availability",
        text: "See open lanes from 7 AM to 10 PM and pick your hour.",
      },
      {
        icon: MailCheck,
        title: "Instant confirmation",
        text: "Your booking details land in your inbox straight away.",
      },
      {
        icon: RotateCcw,
        title: "Cancel online",
        text: "Plans changed? Cancel from your account; card payments are refunded.",
      },
    ],
  },
  admin: {
    headline: "Run the centre from one place",
    text: "Bookings, lanes, slots, walk-ins and reports for Ravenhall staff.",
    benefits: [
      {
        icon: CalendarClock,
        title: "Bookings and slots",
        text: "Confirm, complete or cancel bookings and manage lane times.",
      },
      {
        icon: CircleCheck,
        title: "Walk-in register",
        text: "Take counter bookings and payments with the POS.",
      },
      {
        icon: MailCheck,
        title: "Customers kept informed",
        text: "Changes notify customers in the app and by email.",
      },
    ],
  },
}

/** Square brand mark: a cricket bat and ball on navy */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 4.5 19.5 9.5 10 19a2.1 2.1 0 0 1-3 0L5 17a2.1 2.1 0 0 1 0-3z" />
        <path d="m17 7 3.5-3.5" />
        <circle cx="18.5" cy="18.5" r="2" fill="currentColor" stroke="none" />
      </svg>
    </span>
  )
}

/** Pill link back to the public site; the arrow nudges left on hover */
function BackLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-xs transition-colors outline-none focus-visible:ring-3 active:translate-y-px motion-reduce:transition-none sm:min-h-10",
        className
      )}
    >
      <ArrowLeft
        className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
      />
      {label}
    </Link>
  )
}

type AuthLayoutProps = {
  role: "customer" | "admin"
  /** Small label above the title, e.g. "Customer account" */
  eyebrow: string
  title: string
  subtitle: string
  backHref: string
  backLabel: string
  /** Line under the form, e.g. "New here? Create an account" */
  footer?: React.ReactNode
  children: React.ReactNode
}

/**
 * Split auth layout: branded panel on the left from lg up, form on the right.
 * Below lg the panel collapses to a compact brand header above the form.
 */
export function AuthLayout({
  role,
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel,
  footer,
  children,
}: AuthLayoutProps) {
  const brand = BRAND[role]

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Brand panel (desktop) */}
      {/* Fixed navy in both themes: the panel is a photo-backed brand surface */}
      <aside className="relative hidden overflow-hidden bg-[#13304f] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src="/images/landing/hero.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-35 mix-blend-luminosity"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-[#0b1a2e] via-[#0f2440]/85 to-[#13304f]/60"
        />

        <div className="relative flex items-center justify-between gap-4">
          <Link
            href={backHref}
            aria-label="Ravenhall Cricket home"
            className="-m-1.5 flex items-center gap-3 rounded-xl p-1.5 outline-none focus-visible:ring-3 focus-visible:ring-white/50"
          >
            <BrandMark className="bg-white/10 text-white ring-1 ring-white/20" />
            <span>
              <span className="block font-heading text-lg font-semibold">
                Ravenhall Cricket
              </span>
              <span className="block text-xs text-white/70">
                Indoor Cricket Centre
              </span>
            </span>
          </Link>
          <BackLink
            href={backHref}
            label={backLabel}
            className="border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/20 focus-visible:ring-white/50"
          />
        </div>

        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <h2 className="font-heading text-4xl leading-tight font-semibold tracking-tight text-balance">
              {brand.headline}
            </h2>
            <p className="text-base text-white/75">{brand.text}</p>
          </div>
          <ul className="space-y-5">
            {brand.benefits.map(({ icon: Icon, title: benefitTitle, text }) => (
              <li key={benefitTitle} className="flex gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-4.5 text-[#86efac]" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{benefitTitle}</p>
                  <p className="text-sm text-white/70">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/55">
          © {new Date().getFullYear()} Ravenhall Indoor Cricket Centre
        </p>
      </aside>

      {/* Form side */}
      <div className="flex min-w-0 flex-col px-4 py-6 sm:px-8 sm:py-10">
        {/* Compact header below lg; on desktop the brand panel carries these */}
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <BackLink
            href={backHref}
            label={backLabel}
            className="border-border bg-card text-foreground hover:border-secondary/40 hover:bg-muted focus-visible:ring-secondary/40"
          />
          <Link
            href={backHref}
            aria-label="Ravenhall Cricket home"
            className="flex min-h-11 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-secondary/40"
          >
            <BrandMark className="size-8 rounded-lg [&_svg]:size-4" />
            <span className="font-heading text-sm font-semibold max-[360px]:sr-only">
              Ravenhall Cricket
            </span>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          <header className="mb-7 space-y-2">
            <p className="text-xs font-semibold tracking-[0.12em] text-secondary uppercase dark:text-sky-300">
              {eyebrow}
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </header>

          {children}

          {footer && (
            <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
