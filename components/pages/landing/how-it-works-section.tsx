import { CheckCircle2 } from "lucide-react"

import { bookingSteps } from "@/components/pages/landing/data"

export function HowItWorksSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-primary px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-foreground)_0%,transparent_45%)] opacity-15" />
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 sm:text-base">
            Step onto the pitch in three simple steps.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {bookingSteps.map((step, index) => (
            <article
              key={step.id}
              className="rounded-3xl bg-primary-foreground/5 p-6 text-center backdrop-blur-sm"
            >
              <div className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full border-2 border-primary-foreground/15 bg-primary text-lg font-black text-accent">
                {step.complete ? <CheckCircle2 className="size-7" /> : step.id}
              </div>
              <h3 className="text-lg font-bold text-primary-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                {step.description}
              </p>
              {index < bookingSteps.length - 1 ? (
                <div className="mx-auto mt-6 hidden h-px w-24 bg-primary-foreground/20 md:block" />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
