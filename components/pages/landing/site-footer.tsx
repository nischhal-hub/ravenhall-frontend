"use client"

import Link from "next/link"
import { Send } from "lucide-react"
import { contactInfo, footerLinks, socials } from "./data"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer
      id="contact"
      style={{ background: "var(--gradient-brand)" }}
      className="relative border-t border-white/10 bg-[#0c1827] px-4 pt-16 pb-12 text-sm text-slate-300 dark:border-white/5 dark:bg-[#070e17] sm:px-6 lg:px-8"
    >
      {/* Subtle top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(46,109,164,0.15),transparent_70%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-xs font-black tracking-wider text-accent-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
              RH
            </div>
            <p className="font-heading text-2xl font-black italic tracking-tight text-white">
              Ravenhall <span className="text-accent">Cricket</span>
            </p>
          </Link>

          <p className="text-sm leading-relaxed text-slate-300/85">
            Melbourne West&apos;s premier indoor cricket destination for
            training, team preparation, and year-round match readiness.
          </p>

          <div className="flex items-center gap-2 pt-1">
            {socials.map((social) => {
              const Icon = social.icon

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:scale-105 hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </Link>
              )
            })}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="size-2 rounded-full bg-accent animate-pulse" />
            Open 7 Days • Fast Online Booking
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="mb-4 font-heading text-sm font-bold tracking-wider text-white uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/lanes"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Our Lanes & Booking
              </Link>
            </li>
            <li>
              <Link
                href="/membership"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Membership Plans
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-slate-300 transition-colors hover:text-white"
              >
                About Our Facility
              </Link>
            </li>
            <li>
              <Link
                href="/panel"
                className="text-slate-300 transition-colors hover:text-white"
              >
                Customer Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Visit Us Column */}
        <div>
          <h4 className="mb-4 font-heading text-sm font-bold tracking-wider text-white uppercase">
            Visit Us
          </h4>
          <ul className="space-y-3.5 text-sm">
            {contactInfo.map((item) => {
              const Icon = item.icon

              return (
                <li
                  key={item.text}
                  className="flex items-start gap-3 leading-relaxed text-slate-300"
                >
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-accent">
                    <Icon className="size-3.5" />
                  </div>
                  <span>{item.text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="mb-4 font-heading text-sm font-bold tracking-wider text-white uppercase">
            Stay Updated
          </h4>
          <p className="mb-3 text-sm leading-relaxed text-slate-300/85">
            Get exclusive member offers, coaching clinic alerts, and priority lane
            updates.
          </p>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              required
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-xl bg-accent text-accent-foreground shadow-sm transition-transform hover:bg-accent/90 active:scale-95"
              aria-label="Subscribe to newsletter"
            >
              <Send className="size-4" />
            </Button>
          </form>
          <p className="mt-2 text-xs text-slate-400">
            Instant booking confirmation. No spam, ever.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative mx-auto mt-12 flex w-full max-w-7xl flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
        <p>© 2026 Ravenhall Indoor Cricket Centre. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
