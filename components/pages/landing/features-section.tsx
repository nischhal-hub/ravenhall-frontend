import { features } from "@/components/pages/landing/data"

export function FeaturesSection() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Professional-standard lanes, digital-first convenience, and a modern
            training experience built for every level.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="rounded-3xl bg-muted p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary p-3 text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
