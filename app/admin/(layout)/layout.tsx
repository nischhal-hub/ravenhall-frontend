"use client"

import WebSidebarHeader from "@/components/sidebar/header"
import {
  type ReusableSidebarItem,
  ReusableSidebarLayout,
} from "@/components/ui/sidebar/index"
import {
  BadgePercent,
  BarChart3,
  CalendarCheck2,
  Clock,
  Crown,
  LayoutDashboard,
  Users,
  Volleyball,
} from "lucide-react"

const webSidebarItems: ReusableSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboard />,
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/bookings",
    icon: <CalendarCheck2 />,
  },

  {
    id: "lanes",
    label: "Lanes",
    href: "/lanes",
    icon: <Volleyball />,
  },
  {
    id: "slots",
    label: "Slots",
    href: "/slots",
    icon: <Clock />,
  },
  {
    id: "users",
    label: "Users",
    href: "/users",
    icon: <Users />,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 />,
  },
  {
    id: "discount-codes",
    label: "Discount Codes",
    href: "/discount-codes",
    icon: <BadgePercent />,
  },
  {
    id: "membership",
    label: "Membership",
    href: "/membership",
    icon: <Crown />,
  },
]

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ReusableSidebarLayout
        items={webSidebarItems}
        collapsible="icon"
        defaultOpen
        header={({ isCollapsed }) => (
          <WebSidebarHeader isCollapsed={isCollapsed} role="admin" />
        )}
      >
        <div className="max-h-screen overflow-y-auto px-5 py-3">{children}</div>
      </ReusableSidebarLayout>
    </div>
  )
}
