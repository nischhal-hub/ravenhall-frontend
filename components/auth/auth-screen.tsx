"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  useForm,
  type FieldValues,
  type Path,
  type Resolver,
  type UseFormSetError,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, CircleCheck } from "lucide-react"

import {
  ForgotPasswordFormSection,
  LoginFormSection,
  RegisterFormSection,
  ResetPasswordFormSection,
  VerifyEmailFormSection,
} from "@/components/auth/auth-form-sections"
import {
  forgotPasswordSchema,
  loginFormSchema,
  registerFormSchema,
  ResetPasswordPayload,
  resetPasswordSchema,
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
  useResetPasswordMutation,
  useVerifyEmailMutation,
} from "@/services/mutations/auth.mutations"
import { setAuthTokens } from "@/services/auth/token-store"
import { resetUserState } from "@/services/auth/session"
import { useQueryClient } from "@tanstack/react-query"
import { ApiError } from "@/types/response"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthLayout } from "@/components/auth/auth-layout"

type AuthMode =
  "login" | "register" | "forgot-password" | "verify-email" | "reset-password"
type AuthRole = "customer" | "admin"

type AuthScreenProps = {
  mode: AuthMode
  role: AuthRole
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
      resetPasswordHref: "/admin/auth/reset-password",
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
    backLabel: "Back to home",
    resetPasswordHref: "/auth/reset-password",
  }
}

function screenMeta(mode: AuthMode, role: AuthRole) {
  const eyebrow = role === "admin" ? "Staff portal" : "Customer account"

  if (mode === "register") {
    return {
      eyebrow,
      title: "Create your account",
      subtitle:
        "It takes a minute. You'll confirm your email with a 6‑digit code.",
      footerText: "Already have an account?",
      footerLink: "Log in",
    }
  }

  if (mode === "forgot-password") {
    return {
      eyebrow,
      title: "Forgot your password?",
      subtitle:
        "Enter the email you signed up with and we'll send you a reset code.",
      footerText: "Remembered it?",
      footerLink: "Back to log in",
    }
  }

  if (mode === "verify-email") {
    return {
      eyebrow,
      title: "Check your email",
      subtitle: "We sent a 6‑digit code to the address you registered with.",
      footerText: "Already verified?",
      footerLink: "Log in",
    }
  }
  if (mode === "reset-password") {
    return {
      eyebrow,
      title: "Set a new password",
      subtitle: "Enter the code from your email and choose a new password.",
      footerText: "Remembered it?",
      footerLink: "Back to log in",
    }
  }

  return {
    eyebrow,
    title: "Welcome back",
    subtitle:
      role === "admin"
        ? "Log in to manage bookings, lanes and the centre."
        : "Log in to book lanes and manage your bookings.",
    footerText: "New here?",
    footerLink: "Create an account",
  }
}

/**
 * Plain-language message for a failed auth request. Login never says whether
 * the email exists: the server answers 401 for both cases.
 */
function friendlyAuthError(error: unknown, mode: AuthMode): string {
  if (!(error instanceof ApiError)) {
    return "Something went wrong. Please try again."
  }
  if (!error.status) {
    return "We couldn't reach the server. Check your internet connection and try again."
  }
  if (error.status === 429) {
    return "Too many attempts. Please wait a while before trying again."
  }
  if (mode === "login" && (error.status === 401 || error.status === 400)) {
    return "That email and password don't match. Check them and try again, or reset your password."
  }
  if (mode === "register" && error.status === 409) {
    return "An account with this email already exists. Log in instead, or reset your password."
  }
  if (error.status >= 500) {
    return "Something went wrong on our side. Please try again in a moment."
  }
  return error.message || "Something went wrong. Please try again."
}

export function AuthScreen({ mode, role }: AuthScreenProps) {
  const isRegister = mode === "register"
  const isForgotPassword = mode === "forgot-password"
  const isVerifyEmail = mode === "verify-email"
  const isResetPassword = mode === "reset-password"

  const roleInfo = roleContent(role)
  const meta = screenMeta(mode, role)
  const router = useRouter()
  const queryClient = useQueryClient()

  const registerMutation = useRegisterMutation()
  const loginMutation = useLoginMutation()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const verifyEmailMutation = useVerifyEmailMutation()
  const resetPasswordMutation = useResetPasswordMutation()

  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Validate on blur first, then live once a field has been touched
  const registerForm = useForm<RegisterFormValues>({
    mode: "onTouched",
    resolver: zodResolver(registerFormSchema) as Resolver<RegisterFormValues>,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const loginForm = useForm<LoginPayload>({
    mode: "onTouched",
    resolver: zodResolver(loginFormSchema) as Resolver<LoginPayload>,
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const forgotPasswordForm = useForm<ForgotPasswordPayload>({
    mode: "onTouched",
    resolver: zodResolver(
      forgotPasswordSchema.shape.body
    ) as Resolver<ForgotPasswordPayload>,
    defaultValues: {
      email: "",
    },
  })

  const verifyEmailForm = useForm<VerifyEmailFormValues>({
    mode: "onTouched",
    resolver: zodResolver(
      verifyEmailFormSchema
    ) as Resolver<VerifyEmailFormValues>,
    defaultValues: {
      token: "",
    },
  })

  const resetPasswordForm = useForm<ResetPasswordPayload>({
    mode: "onTouched",
    resolver: zodResolver(
      resetPasswordSchema
    ) as Resolver<ResetPasswordPayload>,
    defaultValues: {
      body: {
        token: "",
        password: "",
      },
    },
  })

  const isSubmitting =
    registerMutation.isPending ||
    loginMutation.isPending ||
    forgotPasswordMutation.isPending ||
    verifyEmailMutation.isPending ||
    resetPasswordMutation.isPending

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
      router.push("/auth/verify-email")
    } catch (error) {
      setFormError(friendlyAuthError(error, "register"))
      if (error instanceof ApiError) {
        applyServerFieldErrors(registerForm.setError, error.details?.errors)
        if (error.status === 409) {
          registerForm.setError(
            "email",
            { type: "server", message: "This email is already registered." },
            { shouldFocus: true }
          )
        }
      }
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
      // Start the new session with an empty cache so no previous account's
      // bookings/notifications can render before fresh data arrives
      await resetUserState(queryClient)
      if (response.data?.accessToken) {
        setAuthTokens(
          {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
          authenticatedRole
        )
      }
      setFormSuccess("Login successful.")
      router.replace(roleInfo.dashboardHref)
    } catch (error) {
      setFormError(friendlyAuthError(error, "login"))
      if (error instanceof ApiError) {
        applyServerFieldErrors(loginForm.setError, error.details?.errors)
      }
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
        router.push("/auth/reset-password")
      } catch (error) {
        setFormError(friendlyAuthError(error, "forgot-password"))
        if (error instanceof ApiError) {
          applyServerFieldErrors(
            forgotPasswordForm.setError,
            error.details?.errors
          )
        }
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
        toast.success("Email verified. You can now log in.")
        router.replace(roleInfo.switchToLoginHref)
      } catch (error) {
        setFormError(friendlyAuthError(error, "verify-email"))
        if (error instanceof ApiError) {
          applyServerFieldErrors(
            verifyEmailForm.setError,
            error.details?.errors
          )
        }
      }
    }
  )
  const handleResetPasswordSubmit = resetPasswordForm.handleSubmit(
    async (values) => {
      clearMessages()
      resetPasswordForm.clearErrors()

      const parsed = resetPasswordSchema.safeParse(values)

      if (!parsed.success) {
        applyZodFieldErrors(
          resetPasswordForm.setError,
          parsed.error.flatten().fieldErrors
        )
        return
      }

      try {
        const response = await resetPasswordMutation.mutateAsync(
          parsed.data.body
        )

        setFormSuccess(response.message ?? "Password reset successfully.")
        resetPasswordForm.reset()

        toast.success("Password reset successfully. You can now log in.")
        router.replace(roleInfo.switchToLoginHref)
      } catch (error) {
        setFormError(friendlyAuthError(error, "reset-password"))
        if (error instanceof ApiError) {
          applyServerFieldErrors(
            resetPasswordForm.setError,
            error.details?.errors
          )
        }
      }
    }
  )
  return (
    <AuthLayout
      role={role}
      eyebrow={meta.eyebrow}
      title={meta.title}
      subtitle={meta.subtitle}
      backHref={roleInfo.backHref}
      backLabel={roleInfo.backLabel}
      footer={
        <>
          {meta.footerText}{" "}
          <Link
            href={
              mode === "login"
                ? roleInfo.switchToRegisterHref
                : roleInfo.switchToLoginHref
            }
            className="rounded font-semibold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-secondary/40 dark:text-sky-300"
          >
            {meta.footerLink}
          </Link>
        </>
      }
    >
      {formError ? (
        <Alert variant="destructive" className="mb-5 px-3.5 py-3" role="alert">
          <CircleAlert />
          <AlertDescription className="text-sm text-destructive">
            {formError}
          </AlertDescription>
        </Alert>
      ) : null}

      {formSuccess ? (
        <Alert className="mb-5 border-emerald-600/40 px-3.5 py-3" role="status">
          <CircleCheck className="text-emerald-700 dark:text-emerald-400" />
          <AlertDescription className="text-sm text-foreground">
            {formSuccess}
          </AlertDescription>
        </Alert>
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
      {isResetPassword ? (
        <ResetPasswordFormSection
          form={resetPasswordForm}
          onSubmit={handleResetPasswordSubmit}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </AuthLayout>
  )
}
