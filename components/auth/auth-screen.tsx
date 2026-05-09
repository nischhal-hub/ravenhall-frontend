"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormSetError,
} from "react-hook-form"

import {
  ForgotPasswordFormSection,
  LoginFormSection,
  RegisterFormSection,
  VerifyEmailFormSection,
} from "@/components/auth/auth-form-sections"
import {
  forgotPasswordSchema,
  loginFormSchema,
  registerFormSchema,
  verifyEmailFormSchema,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterFormValues,
  type VerifyEmailFormValues,
} from "@/schemas/auth"
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
} from "@/services/mutations/auth.mutations"
import { setAuthTokens } from "@/services/auth/token-store"
import { ApiError } from "@/types/response"

type AuthMode = "login" | "register" | "forgot-password" | "verify-email"
type AuthRole = "customer" | "admin"

type AuthScreenProps = {
  mode: AuthMode
  role: AuthRole
}

type RegisterFormState = Omit<RegisterFormValues, "terms"> & {
  terms: boolean
}

function normalizeRole(value: unknown): AuthRole | null {
  if (typeof value !== "string") {
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

function roleContent(role: AuthRole) {
  if (role === "admin") {
    return {
      title: "Admin Portal",
      badge: "Administration Access",
      subText: "Manage schedules, memberships, and venue operations.",
      switchToLoginHref: "/admin/auth",
      switchToRegisterHref: "/admin/auth/register",
      forgotPasswordHref: "/admin/auth/forgot-password",
      verifyEmailHref: "/admin/auth/verify-email",
      dashboardHref: "/admin",
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
    forgotPasswordHref: "/auth/forgot-password",
    verifyEmailHref: "/auth/verify-email",
    dashboardHref: "/panel",
    backHref: "/",
    backLabel: "Back to landing",
  }
}

function screenMeta(mode: AuthMode) {
  if (mode === "register") {
    return {
      eyebrow: "Create account",
      footerText: "Already have an account?",
    }
  }

  if (mode === "forgot-password") {
    return {
      eyebrow: "Recover access",
      footerText: "Remembered your password?",
    }
  }

  if (mode === "verify-email") {
    return {
      eyebrow: "Verify email",
      footerText: "Already verified your account?",
    }
  }

  return {
    eyebrow: "Welcome back",
    footerText: "New to Ravenhall?",
  }
}

export function AuthScreen({ mode, role }: AuthScreenProps) {
  const isRegister = mode === "register"
  const isForgotPassword = mode === "forgot-password"
  const isVerifyEmail = mode === "verify-email"

  const roleInfo = roleContent(role)
  const meta = screenMeta(mode)
  const router = useRouter()

  const registerMutation = useRegisterMutation()
  const loginMutation = useLoginMutation()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const verifyEmailMutation = useVerifyEmailMutation()

  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  const registerForm = useForm<RegisterFormState>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const loginForm = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const forgotPasswordForm = useForm<ForgotPasswordPayload>({
    defaultValues: {
      email: "",
    },
  })

  const verifyEmailForm = useForm<VerifyEmailFormValues>({
    defaultValues: {
      token: "",
    },
  })

  const isSubmitting =
    registerMutation.isPending ||
    loginMutation.isPending ||
    forgotPasswordMutation.isPending ||
    verifyEmailMutation.isPending

  function clearMessages() {
    setFormError("")
    setFormSuccess("")
  }

  function applyServerFieldErrors<TValues extends FieldValues>(
    setError: UseFormSetError<TValues>,
    errors: Record<string, string[]> | undefined
  ) {
    if (!errors) {
      return
    }

    for (const [field, messages] of Object.entries(errors)) {
      if (messages.length > 0) {
        setError(field as Path<TValues>, {
          type: "server",
          message: messages[0] ?? "Invalid value",
        })
      }
    }
  }

  function applyZodFieldErrors<TValues extends FieldValues>(
    setError: UseFormSetError<TValues>,
    errors: Record<string, string[] | undefined>
  ) {
    for (const [field, messages] of Object.entries(errors)) {
      if (messages && messages.length > 0) {
        setError(field as Path<TValues>, {
          type: "validate",
          message: messages[0] ?? "Invalid value",
        })
      }
    }
  }

  const handleRegisterSubmit = registerForm.handleSubmit(async (values) => {
    clearMessages()
    registerForm.clearErrors()

    if (role === "admin") {
      setFormError(
        "Admin accounts are provisioned by the system. Please contact a super admin."
      )
      return
    }

    const parsed = registerFormSchema.safeParse(values)
    if (!parsed.success) {
      applyZodFieldErrors(
        registerForm.setError,
        parsed.error.flatten().fieldErrors
      )
      return
    }

    const payload = {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone?.trim() || undefined,
    }

    try {
      await registerMutation.mutateAsync(payload)
      setFormSuccess("Registration successful. Please verify your email.")
      registerForm.reset()
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message)
        applyServerFieldErrors(registerForm.setError, error.details?.errors)
        return
      }

      setFormError("Registration failed. Please try again.")
    }
  })

  const handleLoginSubmit = loginForm.handleSubmit(async (values) => {
    clearMessages()
    loginForm.clearErrors()

    const parsed = loginFormSchema.safeParse(values)
    if (!parsed.success) {
      applyZodFieldErrors(
        loginForm.setError,
        parsed.error.flatten().fieldErrors
      )
      return
    }

    try {
      const response = await loginMutation.mutateAsync({
        email: parsed.data.email.trim(),
        password: parsed.data.password,
      })
      const authenticatedRole = normalizeRole(response.data.user?.role)
      console.log(response)
      if (!authenticatedRole) {
        setFormError("Login succeeded but role information is missing.")
        return
      }

      if (authenticatedRole !== role) {
        setFormError(
          role === "admin"
            ? "This account is not an admin account."
            : "This account is not a customer account."
        )
        return
      }
      if (response.data?.accessToken) {
        setAuthTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      }
      setFormSuccess("Login successful.")
      router.replace(roleInfo.dashboardHref)
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message)
        applyServerFieldErrors(loginForm.setError, error.details?.errors)
        return
      }

      setFormError("Login failed. Please try again.")
    }
  })

  const handleForgotPasswordSubmit = forgotPasswordForm.handleSubmit(
    async (values) => {
      clearMessages()
      forgotPasswordForm.clearErrors()

      const parsed = forgotPasswordSchema.shape.body.safeParse(values)
      if (!parsed.success) {
        applyZodFieldErrors(
          forgotPasswordForm.setError,
          parsed.error.flatten().fieldErrors
        )
        return
      }

      try {
        const response = await forgotPasswordMutation.mutateAsync(parsed.data)
        setFormSuccess(
          response.message ?? "Password reset email sent if account exists."
        )
      } catch (error) {
        if (error instanceof ApiError) {
          setFormError(error.message)
          applyServerFieldErrors(
            forgotPasswordForm.setError,
            error.details?.errors
          )
          return
        }

        setFormError("Failed to send reset email. Please try again.")
      }
    }
  )

  const handleVerifyEmailSubmit = verifyEmailForm.handleSubmit(
    async (values) => {
      clearMessages()
      verifyEmailForm.clearErrors()

      const parsed = verifyEmailFormSchema.safeParse(values)
      if (!parsed.success) {
        applyZodFieldErrors(
          verifyEmailForm.setError,
          parsed.error.flatten().fieldErrors
        )
        return
      }

      try {
        const response = await verifyEmailMutation.mutateAsync(
          parsed.data.token
        )
        setFormSuccess(response.message ?? "Email verified successfully.")
        verifyEmailForm.reset()
        router.replace(roleInfo.switchToLoginHref)
      } catch (error) {
        if (error instanceof ApiError) {
          setFormError(error.message)
          applyServerFieldErrors(
            verifyEmailForm.setError,
            error.details?.errors
          )
          return
        }

        setFormError("Email verification failed. Please try again.")
      }
    }
  )

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
              {meta.eyebrow}
            </p>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
              {roleInfo.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {roleInfo.subText}
            </p>
          </header>

          {formError ? (
            <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {formError}
            </p>
          ) : null}

          {formSuccess ? (
            <p className="mb-4 rounded-lg border border-accent/60 bg-accent/10 px-3 py-2 text-xs font-medium text-accent-foreground">
              {formSuccess}
            </p>
          ) : null}

          {isRegister ? (
            <RegisterFormSection
              form={registerForm}
              onSubmit={handleRegisterSubmit}
              isSubmitting={isSubmitting}
              role={role}
            />
          ) : null}

          {mode === "login" ? (
            <LoginFormSection
              form={loginForm}
              onSubmit={handleLoginSubmit}
              isSubmitting={isSubmitting}
              forgotPasswordHref={roleInfo.forgotPasswordHref}
            />
          ) : null}

          {isForgotPassword ? (
            <ForgotPasswordFormSection
              form={forgotPasswordForm}
              onSubmit={handleForgotPasswordSubmit}
              isSubmitting={isSubmitting}
            />
          ) : null}

          {isVerifyEmail ? (
            <VerifyEmailFormSection
              form={verifyEmailForm}
              onSubmit={handleVerifyEmailSubmit}
              isSubmitting={isSubmitting}
            />
          ) : null}

          <div className="mt-6 border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
            {meta.footerText}{" "}
            <Link
              href={
                mode === "login"
                  ? roleInfo.switchToRegisterHref
                  : roleInfo.switchToLoginHref
              }
              className="font-bold text-primary transition-colors hover:text-secondary"
            >
              {mode === "login" ? "Create account" : "Login"}
            </Link>
          </div>

          {isRegister ? (
            <p className="mt-4 text-center text-[11px] text-muted-foreground/90">
              Need to verify your account?{" "}
              <Link
                href={roleInfo.verifyEmailHref}
                className="font-semibold text-primary hover:text-secondary"
              >
                Verify email
              </Link>
            </p>
          ) : null}

          {mode === "login" ? (
            <p className="mt-5 text-center text-[11px] text-muted-foreground/90">
              Secure access for {role} users.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
