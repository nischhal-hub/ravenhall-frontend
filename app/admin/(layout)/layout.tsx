"use client"

import WebSidebarHeader from "@/components/sidebar/header"
import WebSidebarFooter from "@/components/sidebar/footer"
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
    href: "/admin",
    icon: <LayoutDashboard />,
  },
  {
    id: "bookings",
    label: "Bookings",
    href: "/admin/bookings",
    icon: <CalendarCheck2 />,
  },

  {
    id: "lanes",
    label: "Lanes",
    href: "/admin/lanes",
    icon: <Volleyball />,
  },
  {
    id: "slots",
    label: "Slots",
    href: "/admin/slots",
    icon: <Clock />,
  },
  {
    id: "users",
    label: "Users",
    href: "/admin/users",
    icon: <Users />,
  },
  {
    id: "reports",
    label: "Reports",
    href: "/admin/reports",
    icon: <BarChart3 />,
  },
  {
    id: "discount-codes",
    label: "Discount Codes",
    href: "/admin/discount-codes",
    icon: <BadgePercent />,
  },
  {
    id: "membership",
    label: "Membership",
    href: "/admin/membership",
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
        footer={({ isCollapsed }) => (
          <WebSidebarFooter isCollapsed={isCollapsed} role="admin" />
        )}
      >
        <div className="max-h-screen overflow-y-auto px-5 py-3">{children}</div>
      </ReusableSidebarLayout>
    </div>
  )
}
