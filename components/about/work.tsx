"use client"

import { UserPlus, Search, CreditCard, Dumbbell } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    body: "Sign up in under a minute. Verify your email and you're in — no credit card needed to get started.",
  },
  {
    number: "02",
    icon: Search,
    title: "Pick a lane & time",
    body: "Browse real-time availability across batting, bowling, and general lanes. Filter by date, time, and lane type to find your perfect slot.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Pay securely",
    body: "Checkout via Stripe in seconds. Members have their discount applied automatically. You'll receive an instant booking confirmation.",
  },
  {
    number: "04",
    icon: Dumbbell,
    title: "Show up & train",
    body: "Rock up with your booking reference. Our staff will have your lane ready. Track your sessions in your account dashboard.",
  },
]

export function AboutHowItWorks() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            How It Works
          </p>
          <h2 className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
            From sign-up to
            <br />
            <span className="text-primary">first delivery.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Four steps. No friction. Just cricket.
          </p>
        </div>

        {/* Step grid */}
        <div className="relative grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line — desktop only */}
          <div className="absolute top-8 right-0 left-0 hidden h-px bg-border lg:block" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative px-2 pt-0 pb-8 lg:pb-0">
              {/* Step number bubble */}
              <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary bg-background">
                <step.icon className="h-6 w-6 text-primary" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary font-mono text-[10px] font-black text-white">
                  {i + 1}
                </span>
              </div>

              <p className="font-mono text-[10px] font-bold tracking-widest text-primary/60 uppercase">
                {step.number}
              </p>
              <h3 className="mt-1 font-heading text-base font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
