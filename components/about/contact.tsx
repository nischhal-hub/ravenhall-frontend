"use client"

import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"

const contacts = [
  {
    icon: MapPin,
    label: "Location",
    value: "14 Raven Court, Osborne Park WA 6017",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+61 8 9XXX XXXX",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@ravenhell.com.au",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sun, 6 AM – 10 PM",
  },
]

export function AboutContact() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-primary">
          {/* CTA block */}
          <div className="grid lg:grid-cols-2">
            {/* Left — CTA copy */}
            <div className="px-8 py-12 lg:px-12 lg:py-16">
              <h2 className="font-heading text-3xl leading-tight font-extrabold text-primary-foreground sm:text-4xl">
                Your lane is
                <br />
                waiting.
              </h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-primary-foreground/70">
                Join hundreds of cricketers who&apos;ve made Raven Hell their
                home ground. First session? We&apos;ll have the nets ready
                before you finish lacing up.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/lanes">
                  <Button className="h-11 bg-accent px-6 text-sm font-bold text-accent-foreground hover:bg-accent/90">
                    Book a Lane
                  </Button>
                </Link>
                <Link href="/membership">
                  <Button
                    variant="outline"
                    className="h-11 border-primary-foreground/20 px-6 text-sm font-bold text-primary-foreground hover:border-primary-foreground/40 hover:bg-primary-foreground/10"
                  >
                    View Memberships
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — contact details */}
            <div className="border-t border-primary-foreground/10 px-8 py-12 lg:border-t-0 lg:border-l lg:px-12 lg:py-16">
              <h3 className="mb-6 font-heading text-lg font-bold text-primary-foreground">
                Get in touch
              </h3>
              <ul className="space-y-5">
                {contacts.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                      <c.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-widest text-primary-foreground/60 uppercase">
                        {c.label}
                      </p>
                      <p className="mt-0.5 text-sm text-primary-foreground">
                        {c.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
