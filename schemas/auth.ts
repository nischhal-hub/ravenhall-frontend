import { z } from "zod"

// Same rules as the server (auth.validation.ts); only the wording is friendlier
const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Z]/, "Add at least one uppercase letter")
  .regex(/[0-9]/, "Add at least one number")

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .pipe(z.email("Enter a valid email address, like name@example.com"))

export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z
      .string()
      .trim()
      .min(2, "Enter your first name (at least 2 letters)")
      .max(50, "Keep your first name under 50 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Enter your last name (at least 2 letters)")
      .max(50, "Keep your last name under 50 characters"),
    phone: z.string().optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Enter your password"),
  }),
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
})

export const verifyEmailFormSchema = z.object({
  token: z.string().trim().min(1, "Enter the code from your email"),
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1, "Enter the reset code from your email"),
    password: z.string().min(8, "Use at least 8 characters"),
  }),
})

export const registerFormSchema = registerSchema.shape.body
  .extend({
    confirmPassword: z.string().min(1, "Type your password again"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const loginFormSchema = loginSchema.shape.body

export type RegisterPayload = z.infer<typeof registerSchema>["body"]
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type LoginPayload = z.infer<typeof loginSchema>["body"]
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>["body"]
export type VerifyEmailFormValues = z.infer<typeof verifyEmailFormSchema>
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>
/** Wire shape actually sent to the API (the schema's `body` is nested only for form field paths). */
export type ResetPasswordRequestPayload = ResetPasswordPayload["body"]
