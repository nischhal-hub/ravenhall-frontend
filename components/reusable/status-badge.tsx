import { Badge } from "@/components/ui/badge"

// ================== ACTIVE / INACTIVE ==================

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )
}

// ================== BOOKING STATUS ==================

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  CONFIRMED: { label: "Confirmed", variant: "default" },
  PENDING: { label: "Pending", variant: "secondary" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  COMPLETED: { label: "Completed", variant: "outline" },
}

export function BookingStatusBadge({ status }: { status: string }) {
  const config = BOOKING_STATUS_CONFIG[status as BookingStatus] || {
    label: status,
    variant: "secondary" as const,
  }

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}

// ================== USER ROLE ==================

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN"

const ROLE_COLOR: Record<UserRole, string> = {
  ADMIN: "var(--chart-1)",
  STAFF: "var(--chart-2)",
  CUSTOMER: "var(--chart-3)",
}

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge
      className="text-white"
      style={{ background: ROLE_COLOR[role] }}
    >
      {role}
    </Badge>
  )
}
