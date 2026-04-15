import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export default function CustomerLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}
