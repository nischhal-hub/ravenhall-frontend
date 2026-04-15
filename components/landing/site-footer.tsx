import Link from "next/link"
import { Send } from "lucide-react"
import { contactInfo, footerLinks, socials } from "./data"
import { Button } from "../ui/button"

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="bg-primary px-4 py-14 text-sm text-slate-200 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-4">
        <div className="space-y-5">
          <p className="font-heading text-2xl font-black text-white italic">
            Ravenhall Cricket
          </p>
          <p className="leading-relaxed text-slate-300">
            Melbourne West&apos;s premier indoor cricket destination for
            training, team prep, and year-round match readiness.
          </p>
          <div className="flex items-center gap-2">
            {socials.map((social) => {
              const Icon = social.icon

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="rounded-full bg-white/10 p-2 text-white transition hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Quick Links</h4>
          <ul className="space-y-3">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Visit Us</h4>
          <ul className="space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon

              return (
                <li
                  key={item.text}
                  className="flex items-start gap-3 leading-relaxed"
                >
                  <Icon className="mt-0.5 size-4 text-accent" />
                  <span>{item.text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Newsletter</h4>
          <p className="mb-3 text-slate-300">
            Get offers, coaching updates, and member-only announcements.
          </p>
          <form className="flex items-center gap-2" action="#">
            <input
              type="email"
              placeholder="Your email"
              className="h-10 w-full rounded-lg border border-white/15 bg-white/10 px-3 text-white placeholder:text-slate-300 focus:border-accent focus:outline-none"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 bg-accent text-accent-foreground hover:bg-accent/90"
              aria-label="Submit email"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-300 sm:flex-row sm:items-center">
        <p>© 2026 Ravenhall Indoor Cricket Centre. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-white">
            Sitemap
          </Link>
          <Link href="#" className="hover:text-white">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  )
}
