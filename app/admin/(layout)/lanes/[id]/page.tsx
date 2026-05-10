"use client"

import { useEffect, useState } from "react"
import { Clock, Users, CheckCircle, XCircle, Calendar } from "lucide-react"

interface Lane {
  id: string
  name: string
  type: string
  description: string | null
  capacity: number
  hourlyRate: number
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function LaneDetail() {
  const [lane, setLane] = useState<Lane | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLane = async () => {
      const mockData: Lane = {
        id: "1",
        name: "Lane 1 — Batting",
        type: "BATTING",
        description: null,
        capacity: 6,
        hourlyRate: 45,
        imageUrl: null,
        isActive: true,
        createdAt: "2026-05-09T15:12:43.143Z",
        updatedAt: "2026-05-09T15:12:43.143Z",
      }

      setLane(mockData)
      setLoading(false)
    }

    fetchLane()
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Loading lane details...
      </div>
    )
  }

  if (!lane) return <div>Lane not found</div>

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="overflow-hidden rounded-3xl bg-card shadow-xl">
        {/* HEADER */}
        <div className="relative h-80 bg-gradient-to-br from-primary to-secondary">
          {lane.imageUrl ? (
            <img
              src={lane.imageUrl}
              alt={lane.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 text-4xl backdrop-blur-md">
                  🏏
                </div>
                <p className="text-lg font-medium text-white/90">
                  Batting Lane
                </p>
              </div>
            </div>
          )}

          {/* STATUS */}
          <div className="absolute top-6 right-6">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                lane.isActive
                  ? "bg-accent text-accent-foreground"
                  : "bg-destructive text-white"
              }`}
            >
              {lane.isActive ? (
                <CheckCircle size={18} />
              ) : (
                <XCircle size={18} />
              )}
              {lane.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {lane.name}
              </h1>
              <p className="mt-1 text-lg font-medium text-muted-foreground">
                {lane.type}
              </p>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold text-primary">
                ${lane.hourlyRate}
              </div>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>
          </div>

          {lane.description && (
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {lane.description}
            </p>
          )}

          {/* STATS */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Capacity */}
            <div className="flex items-center gap-4 rounded-2xl bg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="text-primary" size={26} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-2xl font-semibold">{lane.capacity} people</p>
              </div>
            </div>

            {/* Rate */}
            <div className="flex items-center gap-4 rounded-2xl bg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <Clock className="text-secondary" size={26} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-2xl font-semibold">${lane.hourlyRate}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-4 rounded-2xl bg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                <Calendar className="text-accent" size={26} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Added</p>
                <p className="font-medium">
                  {new Date(lane.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-12 flex gap-4">
            <button className="flex-1 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground hover:opacity-90">
              Book This Lane
            </button>

            <button className="flex-1 rounded-2xl border border-border py-4 text-lg font-semibold hover:bg-muted">
              View Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
