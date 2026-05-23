"use client"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-24 sm:px-6 lg:py-36">
      {/* decorative cricket stump lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -right-16 h-full w-px bg-white/5" />
        <div className="absolute top-0 right-24 h-full w-px bg-white/5" />
        <div className="absolute top-0 right-40 h-full w-px bg-white/5" />
        <div className="absolute top-0 left-1/3 h-full w-px bg-white/5" />
        {/* large faint circle — like a cricket ball */}
        <div className="absolute -right-32 -bottom-32 h-125 w-125 rounded-full border border-white/5" />
        <div className="absolute -right-16 -bottom-16 h-87.5 w-87.5 rounded-full border border-white/5" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <p className="mb-4 font-mono text-xs font-semibold tracking-[0.3em] text-accent uppercase">
          Est. 2024 · Indoor Cricket · Australia
        </p>

        <h1 className="font-heading text-5xl leading-[1.05] font-black text-white sm:text-6xl lg:text-7xl">
          Where Legends
          <br />
          <span className="text-accent">Train Indoors.</span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Raven Hell is Perth&apos;s premier indoor cricket facility —
          purpose-built for players who refuse to let the weather interrupt
          their game. Book a lane, sharpen your skills, and compete year-round.
        </p>

        <div className="mt-12 flex flex-wrap gap-10">
          {[
            { value: "3", label: "Specialist Lanes" },
            { value: "500+", label: "Sessions Booked" },
            { value: "24/7", label: "Online Booking" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-4xl font-black text-accent">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
