"use client"
/* eslint-disable react-hooks/set-state-in-effect */
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Lane } from "@/types/lane-response.types" // Adjust import if needed
import { useLaneQuery } from "@/services/queries/lane.query"
import Link from "next/link"

const fallbackImages = [
  "/images/landing/lane-club.jpg",
  "/images/landing/lane-speed.jpg",
  "/images/landing/lane-opener.jpg",
]

export function LanesSection() {
  const [lanes, setLanes] = useState<Lane[]>([])

  const { data, isLoading, error } = useLaneQuery({
    page: 1,
    limit: 9,
    search: "",
  })

  useEffect(() => {
    if (data?.data) {
      const lanesWithImages = data.data.lanes.map((lane, index) => ({
        ...lane,
        image: fallbackImages[index % fallbackImages.length],
        imageAlt: `${lane.name || "Cricket Lane"} - Professional Indoor Lane`,
        badge: "INDOOR",
      }))
      setLanes(lanesWithImages)
    }
  }, [data])

  if (isLoading) {
    return (
      <section
        id="lanes"
        className="bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10">
            <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
              Our Expert Lanes
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-105 animate-pulse rounded-3xl bg-muted"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        id="lanes"
        className="bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl text-center">
          <p className="text-destructive">
            Failed to load lanes. Please try again later.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="lanes" className="bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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

          {/* Navigation buttons - you can wire these later with real carousel logic */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              disabled
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              disabled
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lanes.map((lane) => (
            <article
              key={lane.id || lane.name}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative h-56">
                <Image
                  src={lane.image}
                  alt={lane.imageAlt || lane.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 rounded-full bg-primary/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-primary-foreground uppercase backdrop-blur-sm">
                  {lane.badge || "INDOOR"}
                </span>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-primary">
                    {lane.name}
                  </h3>
                  <p className="shrink-0 text-xl font-black text-primary">
                    {`$${lane.hourlyRate}` || "$XX"}
                    <span className="text-xs font-medium text-muted-foreground">
                      {lane.period || "/hr"}
                    </span>
                  </p>
                </div>

                {/* Stats - adapt according to your actual Lane type */}
                {Array.isArray(lane.stats) && lane.stats.length > 0 && (
                  <ul className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:text-sm">
                    {lane.stats.map((stat: any) => {
                      const Icon = stat.icon
                      return (
                        <li
                          key={stat.label}
                          className="inline-flex items-center gap-1.5"
                        >
                          {Icon && <Icon className="size-4 text-primary" />}
                          {stat.label}
                        </li>
                      )
                    })}
                  </ul>
                )}
                <Link href={`/lanes/${lane.id}`} className="block">
                  <Button className="h-10 w-full text-sm font-semibold">
                    Book Now
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
