"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { CustomerSummary } from "@/types/dashboard-response"
import { Trophy } from "lucide-react"

interface Props {
  customers: CustomerSummary[]
}

const RANK_STYLE = [
  "bg-yellow-400 text-yellow-900",
  "bg-slate-300 text-slate-700",
  "bg-amber-600 text-amber-50",
]

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

export function TopCustomers({ customers }: Props) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <CardTitle className="text-base font-semibold tracking-tight">
            Top Customers
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          By total spend (confirmed &amp; completed bookings)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col divide-y divide-border">
          {customers.map((c, i) => (
            <div
              key={c.userId}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              {/* Rank badge */}
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  RANK_STYLE[i] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>

              {/* Avatar */}
              <Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-border">
                <AvatarFallback
                  className="text-[11px] font-semibold"
                  style={{
                    background:
                      i === 0
                        ? "var(--chart-1)"
                        : i === 1
                          ? "var(--chart-2)"
                          : "var(--chart-4)",
                    color: "white",
                  }}
                >
                  {initials(c.firstName, c.lastName)}
                </AvatarFallback>
              </Avatar>

              {/* Name + email */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {c.firstName} {c.lastName}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {c.email}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-bold text-foreground tabular-nums">
                  ${c.totalSpent.toLocaleString("en-AU")}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {c.bookings} booking{c.bookings !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          ))}

          {customers.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No data yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
