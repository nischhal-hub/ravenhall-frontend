"use client"

import Link from "next/link"
import type { BaseSyntheticEvent } from "react"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterFormValues,
  ResetPasswordPayload,
} from "@/schemas/auth"

type RegisterFormState = Omit<RegisterFormValues, "terms"> & {
  terms: boolean
}

type RegisterSectionProps = {
  form: UseFormReturn<RegisterFormState>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  role: "customer" | "admin"
}

type LoginSectionProps = {
  form: UseFormReturn<LoginPayload>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
  forgotPasswordHref: string
}

type ForgotPasswordSectionProps = {
  form: UseFormReturn<ForgotPasswordPayload>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
}

type VerifyEmailSectionProps = {
  form: UseFormReturn<{ token: string }>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
}

type ResetPasswordSectionProps = {
  form: UseFormReturn<ResetPasswordPayload>
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
  isSubmitting: boolean
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

export function RegisterFormSection({
  form,
  onSubmit,
  isSubmitting,
  role,
}: RegisterSectionProps) {
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {registerSchemaFields.slice(0, 2).map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <input
                      {...fieldProps}
                      id={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {registerSchemaFields.slice(2, 4).map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: fieldProps }) => (
              <FormItem className="block">
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <input
                    {...fieldProps}
                    value={fieldProps.value ?? ""}
                    id={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required={field.id !== "phone"}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {registerSchemaFields.slice(4).map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <input
                      {...fieldProps}
                      id={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required
                      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="terms"
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormControl>
                <label className="flex items-start gap-3 pt-1">
                  <input
                    checked={fieldProps.value}
                    onBlur={fieldProps.onBlur}
                    onChange={(event) =>
                      fieldProps.onChange(event.target.checked)
                    }
                    name={fieldProps.name}
                    ref={fieldProps.ref}
                    type="checkbox"
                    required
                    className="mt-0.5 h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/25"
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
              </FormControl>
              <FormMessage className="-mt-2" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || role === "admin"}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
        >
          {role === "admin"
            ? "Contact super admin"
            : isSubmitting
              ? "Creating account..."
              : "Create account"}
        </Button>
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
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="block">
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="name@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="block">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="********"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="-mt-1 text-right">
          <Link
            href={forgotPasswordHref}
            className="text-xs font-semibold tracking-wide text-primary hover:text-secondary"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
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
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="name@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
        >
          {isSubmitting ? "Sending reset email..." : "Send reset email"}
        </Button>
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
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email verification token</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="Paste your token"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
        >
          {isSubmitting ? "Verifying email..." : "Verify email"}
        </Button>
      </form>
    </Form>
  )
}

export function ResetPasswordFormSection({
  form,
  onSubmit,
  isSubmitting,
}: ResetPasswordSectionProps) {
  console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <FormField
          control={form.control}
          name="body.token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reset code</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="Enter 6-digit reset code"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="password"
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground transition outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/25"
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition hover:bg-secondary"
        >
          {isSubmitting ? "Resetting password..." : "Reset password"}
        </Button>
      </form>
    </Form>
  )
}
