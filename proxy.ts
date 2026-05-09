import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const ACCESS_TOKEN_COOKIE = "ravenhall_access_token"
const AUTH_ROLE_COOKIE = "ravenhall_role"

const ADMIN_AUTH_PATH = "/admin/auth"
const CUSTOMER_AUTH_PATH = "/auth"

type AuthRole = "admin" | "customer"

function normalizeRole(value: string | undefined): AuthRole | null {
  if (!value) {
    return null
  }

  const normalized = value.toLowerCase()
  if (normalized === "admin") {
    return "admin"
  }

  if (normalized === "customer") {
    return "customer"
  }

  return null
}

function isRouteMatch(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isRouteMatch(pathname, ADMIN_AUTH_PATH)) {
    return NextResponse.next()
  }

  if (isRouteMatch(pathname, CUSTOMER_AUTH_PATH)) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  if (!accessToken) {
    const loginPath = pathname.startsWith("/admin")
      ? ADMIN_AUTH_PATH
      : CUSTOMER_AUTH_PATH
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = loginPath
    loginUrl.search = ""
    return NextResponse.redirect(loginUrl)
  }

  const role = normalizeRole(request.cookies.get(AUTH_ROLE_COOKIE)?.value)
  const isAdminRoute = isRouteMatch(pathname, "/admin")
  const isPanelRoute = isRouteMatch(pathname, "/panel")

  if (isAdminRoute && role === "customer") {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/panel"
    redirectUrl.search = ""
    return NextResponse.redirect(redirectUrl)
  }

  if (isPanelRoute && role === "admin") {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/admin"
    redirectUrl.search = ""
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
}
