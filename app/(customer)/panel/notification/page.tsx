"use client"

import { Bell, CheckCheck, RefreshCw } from "lucide-react"
import { PanelHero } from "@/components/panel/panel-hero"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn, formatDateTime } from "@/lib/utils"
import { useMyNotificationsQuery } from "@/services/queries/notification.query"
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/services/mutations/notification.mutations"

export default function Page() {
  const { data, isLoading, error, refetch } = useMyNotificationsQuery()
  const markRead = useMarkNotificationReadMutation()
  const markAllRead = useMarkAllNotificationsReadMutation()

  const notifications = data?.data?.notifications ?? []
  const unreadCount = data?.data?.unreadCount ?? 0

  return (
    <div className="space-y-4">
      <PanelHero
        eyebrow="Account"
        title="Notifications"
        description="Stay on top of booking updates and offers"
      />

      <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading…"
              : unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={unreadCount === 0 || markAllRead.isPending}
            onClick={() => markAllRead.mutate(undefined)}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Alert variant="destructive" className="max-w-md">
              <AlertDescription>Failed to load notifications.</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
            <Bell className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-muted-foreground">
              Booking updates will show up here.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  disabled={n.isRead}
                  onClick={() => markRead.mutate(n.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors",
                    !n.isRead &&
                      "border-primary/30 bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.isRead ? "bg-transparent" : "bg-primary"
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "truncate text-sm",
                          n.isRead ? "font-medium" : "font-semibold"
                        )}
                      >
                        {n.subject}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDateTime(n.createdAt)}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {n.body}
                    </span>
                    {!n.isRead && (
                      <span className="sr-only">
                        Unread. Select to mark as read.
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
