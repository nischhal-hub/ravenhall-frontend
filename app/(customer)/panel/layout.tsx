"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import WebSidebarHeader from "@/components/sidebar/header"
import {
  ReusableSidebarItem,
  ReusableSidebarLayout,
} from "@/components/ui/sidebar/index"
import {
  Bell,
  CalendarCheck2,
  Crown,
  LayoutDashboard,
  Settings,
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
    id: "memberships",
    label: "Memberships",
    href: "/memberships",
    icon: <Crown />,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    icon: <Bell />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
]

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="customer">
      <div>
        <ReusableSidebarLayout
          items={webSidebarItems}
          collapsible="icon"
          defaultOpen
          header={({ isCollapsed }) => (
            <WebSidebarHeader isCollapsed={isCollapsed} />
          )}
        >
          <div className="max-h-screen overflow-y-auto px-5 py-3">
            {children}
          </div>
        </ReusableSidebarLayout>
      </div>
    </AuthGuard>
  )
}
