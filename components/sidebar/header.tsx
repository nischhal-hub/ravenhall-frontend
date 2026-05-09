"use client"
type WebSidebarHeaderProps = {
  isCollapsed: boolean
  role?: "admin" | "customer"
}

export default function WebSidebarHeader({
  isCollapsed,
  role = "customer",
}: WebSidebarHeaderProps) {
  if (isCollapsed) {
    return (
      <div className="text-center font-heading text-xl font-bold text-primary uppercase">
        RV
      </div>
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="pl-2">
        <p className="truncate font-heading text-lg font-bold">RavenHall</p>
        <p className="truncate text-xs text-muted-foreground">
          {role === "admin" ? "Admin" : "Customer"} Portal
        </p>
      </div>
    </div>
  )
}
