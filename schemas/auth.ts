import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const registerSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: passwordSchema,
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50),
    phone: z.string().optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
  }),
})

export const verifyEmailFormSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
})

export const registerFormSchema = registerSchema.shape.body
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, { message: "You must accept the terms" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const loginFormSchema = loginSchema.shape.body

export type RegisterPayload = z.infer<typeof registerSchema>["body"]
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type LoginPayload = z.infer<typeof loginSchema>["body"]
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>["body"]
export type VerifyEmailFormValues = z.infer<typeof verifyEmailFormSchema>
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>["body"]
