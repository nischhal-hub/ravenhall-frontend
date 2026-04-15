import Link from "next/link"

import { Button } from "@/components/ui/button"

type AuthMode = "login" | "register"
type AuthRole = "customer" | "admin"

type AuthScreenProps = {
  mode: AuthMode
  role: AuthRole
}

const registerSchemaFields = [
  {
    id: "firstName",
    label: "First name",
    type: "text",
    autoComplete: "given-name",
  },
  {
    id: "lastName",
    label: "Last name",
    type: "text",
    autoComplete: "family-name",
  },
  { id: "email", label: "Email address", type: "email", autoComplete: "email" },
  { id: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  {
    id: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    id: "confirmPassword",
    label: "Confirm password",
    type: "password",
    autoComplete: "new-password",
  },
] as const

function roleContent(role: AuthRole) {
  if (role === "admin") {
    return {
      title: "Admin Portal",
      badge: "Operations Access",
      subText: "Manage schedules, memberships, and venue operations.",
      switchToLoginHref: "/admin/auth",
      switchToRegisterHref: "/admin/auth/register",
      backHref: "/",
      backLabel: "Back to main site",
    }
  }

  return {
    title: "Ravenhall Cricket",
    badge: "Customer Access",
    subText: "Book lanes and manage your membership in seconds.",
    switchToLoginHref: "/auth",
    switchToRegisterHref: "/auth/register",
    backHref: "/",
    backLabel: "Back to landing",
  }
}

export function AuthScreen({ mode, role }: AuthScreenProps) {
  const isRegister = mode === "register"
  const roleInfo = roleContent(role)

  return (
    <main className="relative min-h-svh overflow-hidden bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(60rem 35rem at -10% 0%, color-mix(in oklab, var(--secondary) 28%, transparent), transparent 60%), radial-gradient(52rem 34rem at 120% 100%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={roleInfo.backHref}
            className="text-xs font-semibold tracking-[0.15em] text-secondary uppercase transition-colors hover:text-primary"
          >
            {roleInfo.backLabel}
          </Link>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
            {roleInfo.badge}
          </span>
        </div>

        <section className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-[0_24px_48px_-22px_rgba(2,36,72,0.35)] backdrop-blur sm:p-7">
          <header className="mb-6 space-y-2">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {isRegister ? "Create account" : "Welcome back"}
            </p>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
              {roleInfo.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {roleInfo.subText}
            </p>
          </header>

          {isRegister ? (
            <form className="space-y-4" action="#" method="post">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {registerSchemaFields.slice(0, 2).map((field) => (
                  <label key={field.id} className="space-y-1.5">
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {field.label}
                    </span>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                    />
                  </label>
                ))}
              </div>

              {registerSchemaFields.slice(2, 4).map((field) => (
                <label key={field.id} className="block space-y-1.5">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {field.label}
                  </span>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  />
                </label>
              ))}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {registerSchemaFields.slice(4).map((field) => (
                  <label key={field.id} className="space-y-1.5">
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {field.label}
                    </span>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                    />
                  </label>
                ))}
              </div>

              <label className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="mt-0.5 h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/25"
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </label>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
              >
                Create account
              </Button>
            </form>
          ) : (
            <form className="space-y-4" action="#" method="post">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Email address
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="name@example.com"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Password
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="********"
                />
              </label>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
              >
                Login
              </Button>
            </form>
          )}

          <div className="mt-6 border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "New to Ravenhall?"}{" "}
            <Link
              href={
                isRegister
                  ? roleInfo.switchToLoginHref
                  : roleInfo.switchToRegisterHref
              }
              className="font-bold text-primary transition-colors hover:text-secondary"
            >
              {isRegister ? "Login" : "Create account"}
            </Link>
          </div>

          {isRegister ? null : (
            <p className="mt-5 text-center text-[11px] text-muted-foreground/90">
              Secure access for {role} users.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
