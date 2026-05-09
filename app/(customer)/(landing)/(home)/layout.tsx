import { SiteFooter } from "@/components/pages/landing/site-footer"
import { SiteHeader } from "@/components/pages/landing/site-header"

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
