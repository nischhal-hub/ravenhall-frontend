"use client"
import Image from "next/image"
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
        {/* <Image
          src={IMAGES.LOGO}
          alt="Loksewa Setu"
          width={32}
          height={32}
          className="size-8 rounded-md object-cover"
          priority
        /> */}
        RV
      </div>
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* <Image
        src={IMAGES.LOGO}
        alt="Loksewa Setu"
        width={40}
        height={40}
        className="size-10 rounded-md object-cover"
        priority
      /> */}
      <div className="pl-2">
        <p className="truncate font-heading text-lg font-bold">RavenHall</p>
        <p className="truncate text-xs text-muted-foreground">
          {role === "admin" ? "Admin" : "Customer"} Portal
        </p>
      </div>
    </div>
  )
}
