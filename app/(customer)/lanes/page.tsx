"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLaneQuery } from "@/services/queries/lane.query"
import type { Lane } from "@/types/lane-response.types"
import { useRouter } from "next/navigation"

// ─── Constants ────────────────────────────────────────────────────────────────

const fallbackImages = [
  "/images/landing/lane-club.jpg",
  "/images/landing/lane-speed.jpg",
  "/images/landing/lane-opener.jpg",
]

const FILTER_TABS = [
  { label: "All", value: "" },
  { label: "Batting Lanes", value: "BATTING" },
  { label: "Bowling Lanes", value: "BOWLING" },
  { label: "General", value: "GENERAL" },
] as const

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  BATTING: { bg: "bg-emerald-500", text: "text-white" },
  BOWLING: { bg: "bg-orange-500", text: "text-white" },
  GENERAL: { bg: "bg-sky-500", text: "text-white" },
}

const ITEMS_PER_PAGE = 6

// ─── Skeleton ────────────────────────────────────────────────────────────────

function LaneCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

function LaneCard({ lane, index }: { lane: Lane; index: number }) {
  const router = useRouter()
  const typeKey = (lane.type ?? "GENERAL").toUpperCase()
  const style = TYPE_STYLES[typeKey] ?? TYPE_STYLES.GENERAL

  const image = lane.image ?? fallbackImages[index % fallbackImages.length]

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image
          src={image}
          alt={lane.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        <span
          className={`absolute top-3 left-3 ${style.bg} ${style.text} rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase shadow`}
        >
          {typeKey}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base leading-tight font-bold text-foreground">
            {lane.name}
          </h3>
          <div className="shrink-0 text-right">
            <span className="text-xl font-black text-foreground">
              ₹{lane.hourlyRate}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              /hr
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5 text-primary" />
            Up to {lane.capacity} players
          </span>
          {lane.nextSlot && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-primary" />
              Next: {lane.nextSlot}
            </span>
          )}
        </div>

        {lane.stats && lane.stats.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lane.stats.map((s) => (
              <Badge
                key={s.label}
                variant="secondary"
                className="rounded-full px-2.5 text-[11px]"
              >
                {s.label}
              </Badge>
            ))}
          </div>
        )}

        <Button
          className="h-10 w-full rounded-xl text-sm font-semibold"
          onClick={() => router.push(`/lanes/${lane.id}`)}
        >
          Check Availability
        </Button>
      </div>
    </article>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LanesPage() {
  const [activeType, setActiveType] = useState("")
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<"name-asc" | "price-asc" | "price-desc">(
    "name-asc"
  )

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (val: string) => {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQuery(val)
      setPage(1)
    }, 400)
  }

  const handleTypeChange = (val: string) => {
    setActiveType(val)
    setPage(1)
  }

  const { data, isLoading, error } = useLaneQuery({
    page,
    limit: ITEMS_PER_PAGE,
    search: query,
    type: activeType || undefined,
  })

  const lanes = data?.data?.lanes ?? []
  const meta = data?.data?.meta ?? {}
  const total = meta.total ?? 0
  const totalPages = meta.totalPages ?? Math.ceil(total / ITEMS_PER_PAGE)

  // Client-side sorting
  const sortedLanes = [...lanes].sort((a, b) => {
    if (sortBy === "price-asc") return a.hourlyRate - b.hourlyRate
    if (sortBy === "price-desc") return b.hourlyRate - a.hourlyRate
    return a.name.localeCompare(b.name)
  })

  const from = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1
  const to = Math.min(page * ITEMS_PER_PAGE, total)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Browse Our Lanes
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Experience world-class indoor cricket facilities. From professional
            bowling machines to dedicated batting tracks, find your perfect
            practice space.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTypeChange(tab.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  activeType === tab.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search lanes…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-44 rounded-lg pl-8 text-sm"
              />
            </div>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="h-9 w-40 gap-1.5 rounded-lg text-sm">
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A–Z</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-4 text-sm text-destructive">
            Failed to load lanes. Please try again later.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <LaneCardSkeleton key={i} />
            ))
          ) : sortedLanes.length > 0 ? (
            sortedLanes.map((lane, i) => (
              <LaneCard key={lane.id} lane={lane} index={i} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-sm text-muted-foreground">
              No lanes found. Try a different filter or search.
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`size-8 rounded-full text-sm font-medium transition-colors ${
                    page === i + 1
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {!isLoading && total > 0 && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Showing {from}–{to} of {total} lanes
          </p>
        )}
      </div>
    </div>
  )
}
