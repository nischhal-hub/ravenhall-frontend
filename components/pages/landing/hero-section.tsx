import Image from "next/image"
import { Sparkles, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { heroStatus } from "@/components/pages/landing/data"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#17355b] to-[#1e3a5f] px-4 py-16 text-primary-foreground sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 opacity-25">
        <Image
          src="/images/landing/hero.jpg"
          alt="Premium indoor cricket facility with bright lights and turf lanes"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
            <Sparkles className="size-3.5" />
            Melbourne&apos;s Elite Cricket Venue
          </div>

          <h1 className="max-w-xl font-heading text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Book Your Lane at <span className="text-accent">Ravenhall</span>
            <br />
            Indoor Cricket Centre
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            lighting, high-performance turf, and instant digital booking.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              Book a Lane
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            >
              View Membership Plans
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 backdrop-blur-xl sm:p-6 lg:ml-auto lg:w-[30rem]">
          <div className="mb-4 flex items-center justify-between border-b border-primary-foreground/10 pb-3">
            <p className="font-semibold text-primary-foreground">Live Status</p>
            <span className="inline-flex items-center gap-2 text-sm text-accent">
              <span className="size-2 rounded-full bg-accent" />
              Open Now
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroStatus.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-2xl bg-primary-foreground/10 p-4"
                >
                  <p className="text-xs text-primary-foreground/70">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-primary-foreground sm:text-2xl">
                    {item.value}
                  </p>
                  <Icon className="mt-2 size-4 text-accent" />
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-accent/10 p-3">
            <Star className="size-4 text-accent" />
            <p className="text-xs text-primary-foreground/90 sm:text-sm">
              Join 200+ active members training at Ravenhall weekly.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
