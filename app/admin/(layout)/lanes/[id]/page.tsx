"use client"

import { useParams } from "next/navigation"
import { Clock, Users, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ActiveBadge } from "@/components/reusable/status-badge"
import PageHeader from "@/components/ui/page-header"
import { useLaneByIdQuery } from "@/services/queries/lane.query"

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Skeleton className="h-8 w-64" />
      <Card className="overflow-hidden py-0">
        <Skeleton className="h-64 w-full rounded-none" />
        <CardContent className="space-y-6 px-8 py-8">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LaneDetail() {
  const params = useParams()
  const id = params?.id as string

  const { data, isLoading, isError } = useLaneByIdQuery(id)
  const lane = data?.data

  if (isLoading) return <PageSkeleton />

  if (isError || !lane) {
    return (
      <div className="mx-auto max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>Lane not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader size="lg" title={lane.name} description={lane.type} />

      <Card className="overflow-hidden py-0">
        {/* HEADER */}
        <div className="relative h-64 bg-linear-to-br from-primary to-secondary">
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
                  {lane.type}
                </p>
              </div>
            </div>
          )}

          {/* STATUS */}
          <div className="absolute top-6 right-6">
            <ActiveBadge isActive={lane.isActive} />
          </div>
        </div>

        {/* CONTENT */}
        <CardContent className="space-y-8 px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {lane.name}
              </h2>
              <p className="mt-1 text-muted-foreground">{lane.type}</p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                ${lane.hourlyRate}
              </div>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>
          </div>

          {lane.description && (
            <p className="leading-relaxed text-muted-foreground">
              {lane.description}
            </p>
          )}

          {/* STATS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl bg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="text-primary" size={26} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-2xl font-semibold">{lane.capacity} people</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-muted p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <Clock className="text-secondary" size={26} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-2xl font-semibold">${lane.hourlyRate}</p>
              </div>
            </div>

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
          <div className="flex gap-4">
            <Button className="flex-1" size="lg">
              Book This Lane
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              View Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
