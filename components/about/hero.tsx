"use client"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-16 sm:px-6 lg:py-24">
      {/* decorative cricket stump lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -right-16 h-full w-px bg-primary-foreground/5" />
        <div className="absolute top-0 right-24 h-full w-px bg-primary-foreground/5" />
        <div className="absolute top-0 right-40 h-full w-px bg-primary-foreground/5" />
        <div className="absolute top-0 left-1/3 h-full w-px bg-primary-foreground/5" />
        {/* large faint circle — like a cricket ball */}
        <div className="absolute -right-32 -bottom-32 h-125 w-125 rounded-full border border-primary-foreground/5" />
        <div className="absolute -right-16 -bottom-16 h-87.5 w-87.5 rounded-full border border-primary-foreground/5" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <h1 className="max-w-xl font-heading text-4xl leading-tight font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          Where Legends
          <br />
          <span className="text-accent">Train Indoors.</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
          Raven Hell is Perth&apos;s premier indoor cricket facility —
          purpose-built for players who refuse to let the weather interrupt
          their game. Book a lane, sharpen your skills, and compete year-round.
        </p>

        <div className="mt-10 flex flex-wrap gap-10">
          {[
            { value: "3", label: "Specialist Lanes" },
            { value: "500+", label: "Sessions Booked" },
            { value: "24/7", label: "Online Booking" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-4xl font-black text-accent">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-widest text-primary-foreground/60 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
