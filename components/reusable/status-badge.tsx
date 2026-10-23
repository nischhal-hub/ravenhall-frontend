import { Activity, CheckCircle2, Timer, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

// Mirrors the backend's allowed transitions. CANCELLED is deliberately excluded:
// cancelling has its own action (confirmation + reason + customer notification).
const BOOKING_STATUS_UPDATES: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["COMPLETED"],
  CANCELLED: [],
  COMPLETED: [],
}

export function getStatusUpdateOptions(status: string): BookingStatus[] {
  return BOOKING_STATUS_UPDATES[status.toUpperCase() as BookingStatus] ?? []
}

export function isBookingCancellable(status: string) {
  return ["PENDING", "CONFIRMED"].includes(status.toUpperCase())
}

const BOOKING_STATUS_ICON: Record<BookingStatus, React.ElementType> = {
  CONFIRMED: CheckCircle2,
  PENDING: Timer,
  CANCELLED: XCircle,
  COMPLETED: Activity,
}

export function BookingStatusBadge({
  status,
  showIcon,
  className,
}: {
  status: string
  showIcon?: boolean
  className?: string
}) {
  const config = BOOKING_STATUS_CONFIG[status as BookingStatus] || {
    label: status,
    variant: "secondary" as const,
  }
  const Icon = BOOKING_STATUS_ICON[status as BookingStatus]

  return (
    <Badge variant={config.variant} className={cn("capitalize", className)}>
      {showIcon && Icon && <Icon aria-hidden />}
      {config.label}
    </Badge>
  )
}

// ================== PAYMENT STATUS ==================

export const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  SUCCEEDED: { label: "Paid", variant: "default" },
  PAID: { label: "Paid", variant: "default" },
  FAILED: { label: "Failed", variant: "destructive" },
  REFUNDED: { label: "Refunded", variant: "outline" },
  PARTIALLY_REFUNDED: { label: "Partly refunded", variant: "outline" },
  PENDING: { label: "Pending", variant: "secondary" },
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const config = PAYMENT_STATUS_CONFIG[status.toUpperCase()] || {
    label: "Pending",
    variant: "secondary" as const,
  }

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

// ================== MEMBERSHIP STATUS ==================

export type MembershipStatus = "active" | "expiring" | "expired"

const MEMBERSHIP_STATUS_CONFIG: Record<
  MembershipStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  active: { label: "Active", variant: "default" },
  expiring: { label: "Expiring soon", variant: "destructive" },
  expired: { label: "Expired", variant: "destructive" },
}

export function MembershipStatusBadge({
  status,
}: {
  status: MembershipStatus
}) {
  const config = MEMBERSHIP_STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
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
