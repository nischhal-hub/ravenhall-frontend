import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { planPointIcon, plans } from "@/components/pages/landing/data"

export function MembershipSection() {
  const PointIcon = planPointIcon

  return (
    <section
      id="memberships"
      className="bg-background px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
            Membership Plans
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Unlock exclusive rates, priority bookings, and premium training
            perks.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex h-full flex-col justify-between rounded-3xl p-7",
                plan.featured
                  ? "bg-primary text-white shadow-[0_28px_60px_-24px_rgba(30,58,95,0.8)]"
                  : "bg-muted text-foreground"
              )}
            >
              {plan.featured ? (
                <p className="absolute top-0 right-4 rounded-b-2xl bg-accent px-4 py-1 text-[11px] font-black tracking-wider text-accent-foreground uppercase">
                  Most Popular
                </p>
              ) : null}

              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span
                    className={
                      plan.featured ? "text-slate-200" : "text-muted-foreground"
                    }
                  >
                    {plan.period}
                  </span>
                </div>

                {plan.highlight ? (
                  <p
                    className={cn(
                      "mt-5 rounded-xl px-3 py-2 text-center text-xs font-semibold",
                      plan.featured
                        ? "bg-white/10 text-accent"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {plan.highlight}
                  </p>
                ) : null}

                <ul className="mt-6 space-y-3 text-sm">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <PointIcon
                        className={cn(
                          "size-4",
                          plan.featured ? "text-accent" : "text-primary"
                        )}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={cn(
                  "mt-7 h-10 w-full text-sm font-semibold",
                  plan.featured
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : ""
                )}
                variant={plan.featured ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
