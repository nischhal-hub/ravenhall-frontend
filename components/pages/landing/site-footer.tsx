"use client"

import Link from "next/link"
import { contactInfo } from "./data"

export function SiteFooter() {
  return (
    <footer
      id="contact"
      style={{ background: "var(--gradient-brand)" }}
      className="relative border-t border-white/10 bg-[#0c1827] px-4 pt-16 pb-12 text-sm text-slate-300 dark:border-white/5 dark:bg-[#070e17] sm:px-6 lg:px-8"
    >
      {/* Subtle top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(46,109,164,0.15),transparent_70%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-3">
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
                <li key={item.text}>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="flex items-start gap-3 rounded leading-relaxed text-slate-300 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-accent">
                      <Icon className="size-3.5" />
                    </div>
                    <span>{item.text}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative mx-auto mt-12 flex w-full max-w-7xl flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Ravenhall Indoor Cricket Centre. All rights reserved.</p>
      </div>
    </footer>
  )
}
