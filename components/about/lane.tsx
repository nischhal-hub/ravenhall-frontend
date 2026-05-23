"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const lanes = [
  {
    type: "BATTING",
    label: "Batting",
    tag: "3 lanes",
    color: "bg-primary text-white",
    accent: "border-primary/30",
    headline: "Dominate the crease.",
    description:
      "Full-length batting lanes with adjustable throw-down machines, side netting, and HD slow-motion replay screens. Perfect for solo reps, pair work, or group coaching sessions of up to 6 players.",
    perks: [
      "Adjustable bowling machine",
      "Slow-mo replay screen",
      "Up to 6 players",
      "Coaching-ready setup",
    ],
  },
  {
    type: "BOWLING",
    label: "Bowling",
    tag: "2 lanes",
    color: "bg-accent text-accent-foreground",
    accent: "border-accent/30",
    headline: "Find your line & length.",
    description:
      "Dedicated bowling lanes with marked run-up zones, target stump sets, and impact sensors. Train your line, length, and pace variations without hogging a full batting lane.",
    perks: [
      "Marked run-up zones",
      "Impact sensors",
      "Target stump sets",
      "Pace variation training",
    ],
  },
  {
    type: "GENERAL",
    label: "General",
    tag: "Multi-use",
    color: "bg-muted text-foreground",
    accent: "border-border",
    headline: "Team sessions, your way.",
    description:
      "Flexible general-purpose lanes that adapt to warm-ups, fielding drills, throwdowns, or casual hit-arounds. Ideal for clubs running pre-season fitness circuits or mixed-skill group sessions.",
    perks: [
      "Flexible configuration",
      "Fielding drill space",
      "Club session friendly",
      "All skill levels",
    ],
  },
]

export function AboutLanes() {
  return (
    <section className="bg-muted/40 px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            The Facility
          </p>
          <h2 className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
            Three lane types.
            <br />
            <span className="text-primary">One world-class facility.</span>
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {lanes.map((lane) => (
            <article
              key={lane.type}
              className={cn(
                "group relative flex flex-col rounded-3xl border bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
                lane.accent
              )}
            >
              {/* type badge */}
              <div className="mb-5 flex items-center justify-between">
                <Badge
                  className={cn(
                    "rounded-xl px-3 py-1 text-xs font-bold tracking-wide uppercase",
                    lane.color
                  )}
                >
                  {lane.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {lane.tag}
                </span>
              </div>

              <h3 className="font-heading text-xl font-extrabold text-foreground">
                {lane.headline}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {lane.description}
              </p>

              {/* perks */}
              <ul className="mt-6 space-y-2">
                {lane.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {perk}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Capacity note */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          All lanes accommodate up to{" "}
          <strong className="text-foreground">6 players</strong> and can be
          booked in 1-hour increments. Coaching equipment available on request.
        </p>
      </div>
    </section>
  )
}
