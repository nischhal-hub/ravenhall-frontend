"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { startOfDay } from "date-fns"
import {
  CalendarClock,
  Clock,
  DollarSign,
  Info,
  Layers,
  MoreHorizontal,
  Pencil,
  Users,
  Volleyball,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActiveBadge } from "@/components/reusable/status-badge"
import { EmptyState } from "@/components/reusable/empty-state"
import { useModalContext } from "@/components/context/modal-context"
import {
  DetailColumns,
  DetailError,
  DetailLayout,
  DetailNotFound,
  DetailPageHeader,
  DetailSkeleton,
  InfoCard,
  InfoList,
  InfoRow,
  SummaryStrip,
  detailActionClass,
  detailIconActionClass,
  formatDateTime12,
  formatLongDate,
  formatTime,
  humanize,
  isNotFoundError,
} from "@/components/detail"
import { formatCurrency } from "@/lib/utils"
import { useLaneByIdQuery } from "@/services/queries/lane.query"
import type { Slot } from "@/types/lane-response.types"

const UPCOMING_LIMIT = 8

function slotState(slot: Slot) {
  if (slot.isBlocked)
    return { label: "Blocked", variant: "destructive" as const }
  if (!slot.isAvailable) return { label: "Booked", variant: "default" as const }
  return { label: "Open", variant: "outline" as const }
}

export default function LaneDetail() {
  const params = useParams()
  const id = params?.id as string
  const { openModal } = useModalContext()

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useLaneByIdQuery(id)
  const lane = data?.data

  if (isLoading) return <DetailSkeleton mainCards={2} asideCards={1} />

  if (isNotFoundError(error) || (!isError && !lane)) {
    return (
      <DetailNotFound
        title="Lane not found"
        description="This lane doesn't exist, was deleted, or is currently inactive."
        backHref="/admin/lanes"
        backLabel="Lanes"
      />
    )
  }

  if (isError || !lane) {
    return (
      <DetailError
        title="We couldn't load this lane"
        error={error}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        backHref="/admin/lanes"
        backLabel="Lanes"
      />
    )
  }

  const today = startOfDay(new Date())
  const upcoming = (lane.slots ?? []).filter(
    (slot) => new Date(slot.date) >= today
  )
  const openCount = upcoming.filter(
    (slot) => slot.isAvailable && !slot.isBlocked
  ).length

  const actions = (
    <>
      <Button
        className={detailActionClass}
        onClick={() =>
          openModal({ key: "EDIT_LANE", initiatorName: lane.id, data: lane })
        }
      >
        <Pencil />
        Edit lane
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="More actions"
            className={detailIconActionClass}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/admin/slots">
              <CalendarClock />
              Manage slots
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  return (
    <DetailLayout>
      <DetailPageHeader
        backHref="/admin/lanes"
        backLabel="Lanes"
        title={lane.name}
        status={<ActiveBadge isActive={lane.isActive} />}
        meta={`${humanize(lane.type)} lane · Added ${formatLongDate(lane.createdAt)}`}
        actions={actions}
      />

      <SummaryStrip
        items={[
          {
            icon: DollarSign,
            label: "Hourly rate",
            value: formatCurrency(lane.hourlyRate),
          },
          {
            icon: Users,
            label: "Capacity",
            value: `Up to ${lane.capacity} people`,
          },
          { icon: Layers, label: "Type", value: humanize(lane.type) },
          {
            icon: CalendarClock,
            label: "Open slots ahead",
            value: openCount,
            sub: `of ${upcoming.length} upcoming`,
          },
        ]}
      />

      <DetailColumns
        main={
          <>
            <InfoCard icon={Volleyball} title="Lane details">
              <div className="flex flex-col gap-4 sm:flex-row">
                {lane.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- remote upload URL, not a static asset
                  <img
                    src={lane.imageUrl}
                    alt={lane.name}
                    className="aspect-video w-full rounded-md object-cover sm:w-56"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <InfoList>
                    <InfoRow label="Name" value={lane.name} />
                    <InfoRow label="Type" value={humanize(lane.type)} />
                    <InfoRow
                      label="Hourly rate"
                      value={formatCurrency(lane.hourlyRate)}
                    />
                    <InfoRow
                      label="Capacity"
                      value={`Up to ${lane.capacity} people`}
                    />
                    <InfoRow
                      full
                      label="Description"
                      value={lane.description}
                    />
                  </InfoList>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              icon={Clock}
              title="Upcoming slots"
              description={
                upcoming.length > UPCOMING_LIMIT
                  ? `Showing the next ${UPCOMING_LIMIT} of ${upcoming.length}`
                  : undefined
              }
              action={
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-9 md:h-7"
                >
                  <Link href="/admin/slots">Manage slots</Link>
                </Button>
              }
            >
              {upcoming.length === 0 ? (
                <EmptyState
                  size="sm"
                  icon={CalendarClock}
                  title="No upcoming slots"
                  description="Customers can't book this lane until slots are added."
                  className="py-4"
                />
              ) : (
                <ul className="divide-y divide-border">
                  {upcoming.slice(0, UPCOMING_LIMIT).map((slot) => {
                    const state = slotState(slot)
                    return (
                      <li
                        key={slot.id}
                        className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 text-sm">
                          <p className="font-medium">
                            {formatLongDate(slot.date)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(slot.startTime)} –{" "}
                            {formatTime(slot.endTime)}
                          </p>
                        </div>
                        <Badge variant={state.variant}>{state.label}</Badge>
                      </li>
                    )
                  })}
                </ul>
              )}
            </InfoCard>
          </>
        }
        aside={
          <InfoCard icon={Info} title="Record">
            <InfoList columns={1}>
              <InfoRow
                label="Lane ID"
                value={lane.id}
                copyValue={lane.id}
                mono
              />
              <InfoRow
                label="Status"
                value={lane.isActive ? "Active" : "Inactive"}
              />
              <InfoRow label="Added" value={formatDateTime12(lane.createdAt)} />
              <InfoRow
                label="Last updated"
                value={formatDateTime12(lane.updatedAt)}
              />
            </InfoList>
          </InfoCard>
        }
      />
    </DetailLayout>
  )
}
