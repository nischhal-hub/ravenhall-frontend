"use client"

import { Target, Zap, ShieldCheck } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Precision Matters",
    body: "Every lane at Raven Hell is engineered to professional spec — consistent pitch surfaces, regulated ball-return systems, and high-speed bowling machines calibrated to match-day conditions.",
  },
  {
    icon: Zap,
    title: "Always On",
    body: "Our platform never sleeps. Book a batting net at midnight, reschedule before dawn, or grab a last-minute slot on your lunch break. Real-time availability, instant confirmation.",
  },
  {
    icon: ShieldCheck,
    title: "Fair & Transparent",
    body: "No hidden fees, no surprise surcharges. Members unlock automatic discounts at checkout — 10% monthly, 20% annual — applied before you even reach the payment screen.",
  },
]

export function AboutMission() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Asymmetric heading block */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
              Cricket that fits
              <br />
              <span className="text-primary">your schedule.</span>
            </h2>
          </div>
          <div className="flex items-center">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              We built Raven Hell to solve a simple problem: serious cricketers
              shouldn&apos;t have to beg the weather gods for practice time. Our
              climate-controlled facility gives you the repetitions you need,
              when you need them — backed by a booking system that&apos;s as
              disciplined as your batting stance.
            </p>
          </div>
        </div>

        {/* Value pillars */}
        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-base font-bold text-foreground">
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
