"use client"

import * as React from "react"
import Link from "next/link"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
} from "../sidebar"

export type ReusableSidebarSubItem = {
  id?: string
  label: string
  href: string
  isActive?: boolean
}

export type ReusableSidebarItem = {
  id?: string
  label: string
  href?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  isActive?: boolean
  children?: ReusableSidebarSubItem[]
}

export type ReusableSidebarSlotProps = {
  isCollapsed: boolean
}

type ReusableSidebarSlot =
  | React.ReactNode
  | ((props: ReusableSidebarSlotProps) => React.ReactNode)

export type ReusableSidebarProps = {
  items: ReusableSidebarItem[]
  groupLabel?: string
  header?: ReusableSidebarSlot
  footer?: ReusableSidebarSlot
  showCollapseButton?: boolean
  defaultOpen?: boolean
  side?: "left" | "right"
  collapsible?: "offcanvas" | "icon" | "none"
}

type ReusableSidebarLayoutProps = ReusableSidebarProps & {
  children: React.ReactNode
}

function ReusableSidebarMenu({ items }: { items: ReusableSidebarItem[] }) {
  const path = usePathname()
  const isActive = (href: string | undefined, itemIsActive?: boolean) => {
    if (itemIsActive) return true
    if (!href) return false
    return path === href
  }
  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const itemKey = item.id ?? `${item.label}-${index}`

        return (
          <SidebarMenuItem key={itemKey}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              tooltip={item.label}
              className={cn(
                isActive(item.href, item.isActive) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              )}
            >
              {item.href ? (
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button type="button">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </SidebarMenuButton>

            {item.badge ? (
              <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
            ) : null}

            {item.children?.length ? (
              <SidebarMenuSub>
                {item.children.map((child, childIndex) => (
                  <SidebarMenuSubItem
                    key={child.id ?? `${child.label}-${childIndex}`}
                  >
                    <SidebarMenuSubButton asChild isActive={child.isActive}>
                      <Link href={child.href}>
                        <span>{child.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function renderSlot(
  slot: ReusableSidebarSlot | undefined,
  isCollapsed: boolean
) {
  if (!slot) {
    return null
  }

  if (typeof slot === "function") {
    return slot({ isCollapsed })
  }

  return slot
}

function ReusableSidebarShell({
  items,
  groupLabel,
  header,
  footer,
  showCollapseButton,
  side,
  collapsible,
}: {
  items: ReusableSidebarItem[]
  groupLabel?: string
  header?: ReusableSidebarSlot
  footer?: ReusableSidebarSlot
  showCollapseButton: boolean
  side: "left" | "right"
  collapsible: "offcanvas" | "icon" | "none"
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar side={side} collapsible={collapsible} className="relative">
      {header || showCollapseButton ? (
        <SidebarHeader>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              {header ? (
                <div className="w-full">{renderSlot(header, isCollapsed)}</div>
              ) : null}

              {showCollapseButton ? (
                <SidebarTrigger className="shrink-0" />
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {header ? (
                <div className="min-w-0 flex-1">
                  {renderSlot(header, isCollapsed)}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {showCollapseButton ? (
                <SidebarTrigger className="absolute -right-3.5 shrink-0" />
              ) : null}
            </div>
          )}
        </SidebarHeader>
      ) : null}

      <SidebarContent>
        <SidebarGroup>
          {groupLabel ? (
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <ReusableSidebarMenu items={items} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footer ? (
        <SidebarFooter>{renderSlot(footer, isCollapsed)}</SidebarFooter>
      ) : null}
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}

function ReusableSidebarMobileTrigger({
  side,
  showCollapseButton,
}: {
  side: "left" | "right"
  showCollapseButton: boolean
}) {
  if (!showCollapseButton) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-3 z-40 md:hidden",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      <SidebarTrigger className="rounded-md border bg-background shadow-sm" />
    </div>
  )
}

export function ReusableSidebar({
  items,
  groupLabel = "Navigation",
  header,
  footer,
  showCollapseButton = true,
  defaultOpen = true,
  side = "left",
  collapsible = "icon",
}: ReusableSidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ReusableSidebarMobileTrigger
        side={side}
        showCollapseButton={showCollapseButton}
      />

      <ReusableSidebarShell
        items={items}
        groupLabel={groupLabel}
        header={header}
        footer={footer}
        showCollapseButton={showCollapseButton}
        side={side}
        collapsible={collapsible}
      />
    </SidebarProvider>
  )
}

export function ReusableSidebarLayout({
  children,
  ...sidebarProps
}: ReusableSidebarLayoutProps) {
  const side = sidebarProps.side ?? "left"
  const showCollapseButton = sidebarProps.showCollapseButton ?? true

  return (
    <SidebarProvider defaultOpen={sidebarProps.defaultOpen ?? true}>
      <ReusableSidebarMobileTrigger
        side={side}
        showCollapseButton={showCollapseButton}
      />

      <ReusableSidebarShell
        items={sidebarProps.items}
        groupLabel={sidebarProps.groupLabel}
        header={sidebarProps.header}
        footer={sidebarProps.footer}
        showCollapseButton={showCollapseButton}
        side={side}
        collapsible={sidebarProps.collapsible ?? "icon"}
      />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
