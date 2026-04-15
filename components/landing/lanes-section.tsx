import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { lanes } from "@/components/landing/data"

export function LanesSection() {
  return (
    <section id="lanes" className="bg-card px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
              Our Expert Lanes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Professional 22-yard indoor surfaces for batting, bowling, and
              team sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lanes.map((lane) => (
            <article
              key={lane.name}
              className="overflow-hidden rounded-3xl bg-background shadow-[0_16px_40px_-24px_rgba(25,28,30,0.35)]"
            >
              <div className="relative h-56">
                <Image
                  src={lane.image}
                  alt={lane.imageAlt}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 rounded-full bg-primary/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
                  {lane.badge}
                </span>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-primary">
                    {lane.name}
                  </h3>
                  <p className="shrink-0 text-xl font-black text-primary">
                    {lane.price}
                    <span className="text-xs font-medium text-muted-foreground">
                      {lane.period}
                    </span>
                  </p>
                </div>

                <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:text-sm">
                  {lane.stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                      <li
                        key={stat.label}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Icon className="size-4 text-primary" />
                        {stat.label}
                      </li>
                    )
                  })}
                </ul>

                <Button className="h-10 w-full text-sm font-semibold">
                  Book Now
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
