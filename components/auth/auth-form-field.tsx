"use client"

import * as React from "react"
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form"
import { CircleAlert } from "lucide-react"
import { FormField, FormItem, useFormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"

/** Props to spread on the actual <input> so the label, hint and error point at it */
export type FieldControlProps = {
  id: string
  "aria-invalid": boolean
  "aria-describedby"?: string
}

type AuthFormFieldProps<T extends FieldValues, N extends FieldPath<T>> = {
  form: UseFormReturn<T>
  name: N
  label: string
  /** Helper text under the field, shown while there is no error */
  hint?: React.ReactNode
  /** Content to the right of the label, e.g. a "Forgot password?" link */
  labelAside?: React.ReactNode
  /** Extra content under the field (e.g. a strength meter) */
  after?: React.ReactNode
  optional?: boolean
  className?: string
  children: (
    field: ControllerRenderProps<T, N>,
    control: FieldControlProps
  ) => React.ReactNode
}

/**
 * Label + input + hint + error for react-hook-form fields on the auth screens.
 * Presentation only: validation lives in the form's resolver.
 */
export function AuthFormField<T extends FieldValues, N extends FieldPath<T>>({
  form,
  name,
  className,
  ...rest
}: AuthFormFieldProps<T, N>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1.5", className)}>
          <FieldBody field={field} {...rest} />
        </FormItem>
      )}
    />
  )
}

function FieldBody<T extends FieldValues, N extends FieldPath<T>>({
  field,
  label,
  hint,
  labelAside,
  after,
  optional,
  children,
}: Omit<AuthFormFieldProps<T, N>, "form" | "name" | "className"> & {
  field: ControllerRenderProps<T, N>
}) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const describedBy = [
    hint && !error ? formDescriptionId : null,
    error ? formMessageId : null,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={formItemId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {optional && (
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          )}
        </label>
        {labelAside}
      </div>
      {children(field, {
        id: formItemId,
        "aria-invalid": !!error,
        "aria-describedby": describedBy || undefined,
      })}
      {error ? (
        <p
          id={formMessageId}
          role="alert"
          className="flex items-start gap-1.5 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>{String(error.message ?? "")}</span>
        </p>
      ) : (
        hint && (
          <p id={formDescriptionId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
      {after}
    </>
  )
}
