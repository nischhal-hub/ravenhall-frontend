"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type BaseSyntheticEvent } from "react"
import type { UseFormReturn } from "react-hook-form"
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  KeyRound,
  Loader2,
  Mail,
  Phone,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { AuthFormField } from "@/components/auth/auth-form-field"
import { AuthInput } from "@/components/auth/auth-input"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength } from "@/components/auth/password-strength"
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterFormValues,
  ResetPasswordPayload,
} from "@/schemas/auth"

type SubmitHandler = (event?: BaseSyntheticEvent) => Promise<void>

type RegisterSectionProps = {
  form: UseFormReturn<RegisterFormValues>
  onSubmit: SubmitHandler
  isSubmitting: boolean
  role: "customer" | "admin"
}

type LoginSectionProps = {
  form: UseFormReturn<LoginPayload>
  onSubmit: SubmitHandler
  isSubmitting: boolean
  forgotPasswordHref: string
}

type ForgotPasswordSectionProps = {
  form: UseFormReturn<ForgotPasswordPayload>
  onSubmit: SubmitHandler
  isSubmitting: boolean
}

type VerifyEmailSectionProps = {
  form: UseFormReturn<{ token: string }>
  onSubmit: SubmitHandler
  isSubmitting: boolean
}

type ResetPasswordSectionProps = {
  form: UseFormReturn<ResetPasswordPayload>
  onSubmit: SubmitHandler
  isSubmitting: boolean
}

function SubmitButton({
  pending,
  label,
  pendingLabel,
  disabled,
}: {
  pending: boolean
  label: string
  pendingLabel: string
  disabled?: boolean
}) {
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className="h-12 w-full rounded-xl text-base font-semibold transition-colors hover:bg-secondary motion-reduce:transition-none"
    >
      {pending && (
        <Loader2
          className="size-4.5 animate-spin motion-reduce:animate-none"
          aria-hidden
        />
      )}
      {pending ? pendingLabel : label}
    </Button>
  )
}

const codeInputClass =
  "text-center font-mono text-xl tracking-[0.5em] sm:text-lg"

const REGISTER_STEPS = [
  { title: "Your details", fields: ["firstName", "lastName", "email"] },
  {
    title: "Secure your account",
    fields: ["phone", "password", "confirmPassword"],
  },
] as const

export function RegisterFormSection({
  form,
  onSubmit,
  isSubmitting,
  role,
}: RegisterSectionProps) {
  const [step, setStep] = useState<1 | 2>(1)
  // Set when the user moves between steps, so the new step's first field gets focus
  const focusOnStep = useRef<
    (typeof REGISTER_STEPS)[number]["fields"][number] | null
  >(null)

  const email = form.watch("email") ?? ""
  const password = form.watch("password") ?? ""
  const confirmPassword = form.watch("confirmPassword") ?? ""
  const confirmState = form.getFieldState("confirmPassword", form.formState)
  const passwordsMatch =
    confirmPassword.length > 0 &&
    confirmPassword === password &&
    !confirmState.error

  useEffect(() => {
    if (focusOnStep.current) {
      form.setFocus(focusOnStep.current)
      focusOnStep.current = null
    }
  }, [step, form])

  const goToStepTwo = async (event: BaseSyntheticEvent) => {
    event.preventDefault()
    const valid = await form.trigger([...REGISTER_STEPS[0].fields], {
      shouldFocus: true,
    })
    if (valid) {
      focusOnStep.current = "phone"
      setStep(2)
    }
  }

  const submitStepTwo = async (event: BaseSyntheticEvent) => {
    await onSubmit(event)
    // A server error on a step-1 field (e.g. 409 "email already registered")
    // sends the user back to step 1 so they can see and fix it
    const stepOneError = REGISTER_STEPS[0].fields.find(
      (name) => form.getFieldState(name).error
    )
    if (stepOneError) {
      focusOnStep.current = stepOneError
      setStep(1)
    }
  }

  const goBack = () => {
    focusOnStep.current = "firstName"
    setStep(1)
  }

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={step === 1 ? goToStepTwo : submitStepTwo}
        noValidate
      >
        <div className="space-y-2">
          <p
            aria-live="polite"
            className="flex items-baseline justify-between text-sm"
          >
            <span className="font-semibold text-foreground">
              {REGISTER_STEPS[step - 1].title}
            </span>
            <span className="text-muted-foreground">Step {step} of 2</span>
          </p>
          <div className="flex gap-1.5" aria-hidden>
            {REGISTER_STEPS.map((s, i) => (
              <span
                key={s.title}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none",
                  i < step ? "bg-primary dark:bg-sky-400" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AuthFormField form={form} name="firstName" label="First name">
                {(field, control) => (
                  <AuthInput
                    {...field}
                    {...control}
                    autoComplete="given-name"
                    autoCapitalize="words"
                  />
                )}
              </AuthFormField>
              <AuthFormField form={form} name="lastName" label="Last name">
                {(field, control) => (
                  <AuthInput
                    {...field}
                    {...control}
                    autoComplete="family-name"
                    autoCapitalize="words"
                  />
                )}
              </AuthFormField>
            </div>

            <AuthFormField form={form} name="email" label="Email address">
              {(field, control) => (
                <AuthInput
                  {...field}
                  {...control}
                  icon={Mail}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="name@example.com"
                />
              )}
            </AuthFormField>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-base font-semibold transition-colors hover:bg-secondary motion-reduce:transition-none"
            >
              Continue
              <ArrowRight className="size-4.5" aria-hidden />
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3.5 py-2.5 text-sm">
              <span className="min-w-0 truncate text-muted-foreground">
                Signing up as{" "}
                <span className="font-medium text-foreground">{email}</span>
              </span>
              <button
                type="button"
                onClick={goBack}
                className="shrink-0 rounded font-medium text-secondary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-secondary/40 dark:text-sky-300"
              >
                Edit
              </button>
            </div>
            {/* Lets password managers pair the new password with this email */}
            <input
              type="email"
              name="username"
              autoComplete="username"
              value={email}
              readOnly
              tabIndex={-1}
              aria-hidden
              className="sr-only"
            />

            <AuthFormField
              form={form}
              name="phone"
              label="Phone number"
              optional
            >
              {(field, control) => (
                <AuthInput
                  {...field}
                  {...control}
                  value={field.value ?? ""}
                  icon={Phone}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                />
              )}
            </AuthFormField>

            <AuthFormField
              form={form}
              name="password"
              label="Password"
              after={<PasswordStrength value={password} />}
            >
              {(field, control) => (
                <PasswordInput
                  {...field}
                  {...control}
                  withIcon
                  autoComplete="new-password"
                />
              )}
            </AuthFormField>

            <AuthFormField
              form={form}
              name="confirmPassword"
              label="Confirm password"
              after={
                passwordsMatch && (
                  <p
                    role="status"
                    className="flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400"
                  >
                    <CircleCheck className="size-3.5" aria-hidden />
                    Passwords match
                  </p>
                )
              }
            >
              {(field, control) => (
                <PasswordInput
                  {...field}
                  {...control}
                  withIcon
                  autoComplete="new-password"
                />
              )}
            </AuthFormField>

            {role === "admin" && (
              <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                Admin accounts are created by a super admin. Ask them to set up
                your access.
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isSubmitting}
                className="h-12 rounded-xl text-base font-semibold sm:w-32"
              >
                <ArrowLeft className="size-4.5" aria-hidden />
                Back
              </Button>
              <div className="flex-1">
                <SubmitButton
                  pending={isSubmitting}
                  disabled={role === "admin"}
                  label={
                    role === "admin"
                      ? "Contact a super admin"
                      : "Create account"
                  }
                  pendingLabel="Creating your account…"
                />
              </div>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}

export function LoginFormSection({
  form,
  onSubmit,
  isSubmitting,
  forgotPasswordHref,
}: LoginSectionProps) {
  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <AuthFormField form={form} name="email" label="Email address">
          {(field, control) => (
            <AuthInput
              {...field}
              {...control}
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="name@example.com"
            />
          )}
        </AuthFormField>

        <AuthFormField
          form={form}
          name="password"
          label="Password"
          labelAside={
            <Link
              href={forgotPasswordHref}
              className="rounded text-sm font-medium text-secondary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-secondary/40 dark:text-sky-300"
            >
              Forgot password?
            </Link>
          }
        >
          {(field, control) => (
            <PasswordInput
              {...field}
              {...control}
              withIcon
              autoComplete="current-password"
            />
          )}
        </AuthFormField>

        <SubmitButton
          pending={isSubmitting}
          label="Log in"
          pendingLabel="Logging in…"
        />
      </form>
    </Form>
  )
}

export function ForgotPasswordFormSection({
  form,
  onSubmit,
  isSubmitting,
}: ForgotPasswordSectionProps) {
  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <AuthFormField
          form={form}
          name="email"
          label="Email address"
          hint="We'll email you a code to reset your password."
        >
          {(field, control) => (
            <AuthInput
              {...field}
              {...control}
              icon={Mail}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="name@example.com"
            />
          )}
        </AuthFormField>

        <SubmitButton
          pending={isSubmitting}
          label="Send reset code"
          pendingLabel="Sending…"
        />
      </form>
    </Form>
  )
}

export function VerifyEmailFormSection({
  form,
  onSubmit,
  isSubmitting,
}: VerifyEmailSectionProps) {
  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <AuthFormField
          form={form}
          name="token"
          label="Verification code"
          hint="Enter the 6‑digit code we emailed you. It can take a minute to arrive, so check your spam folder too."
        >
          {(field, control) => (
            <AuthInput
              {...field}
              {...control}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              className={codeInputClass}
            />
          )}
        </AuthFormField>

        <SubmitButton
          pending={isSubmitting}
          label="Verify email"
          pendingLabel="Verifying…"
        />
      </form>
    </Form>
  )
}

export function ResetPasswordFormSection({
  form,
  onSubmit,
  isSubmitting,
}: ResetPasswordSectionProps) {
  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <AuthFormField
          form={form}
          name="body.token"
          label="Reset code"
          hint="The 6‑digit code from the email we sent you."
        >
          {(field, control) => (
            <AuthInput
              {...field}
              {...control}
              icon={KeyRound}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className={codeInputClass}
            />
          )}
        </AuthFormField>

        <AuthFormField
          form={form}
          name="body.password"
          label="New password"
          hint="Use at least 8 characters."
        >
          {(field, control) => (
            <PasswordInput
              {...field}
              {...control}
              withIcon
              autoComplete="new-password"
            />
          )}
        </AuthFormField>

        <SubmitButton
          pending={isSubmitting}
          label="Reset password"
          pendingLabel="Resetting…"
        />
      </form>
    </Form>
  )
}
