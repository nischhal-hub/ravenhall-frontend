import {
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

type TFormInputProps<T extends FieldValues> = {
  label?: string
  form: UseFormReturn<T>
  render?: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode
  name: Path<T>
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "url"
    | "file"
    | "textarea"
    | "date"      // ← Added
    | "time"      // ← Added
  placeholder?: string
  required?: boolean
  className?: string
  rows?: number // For textarea
}

export default function FormInput<T extends FieldValues>({
  label,
  form,
  render,
  name,
  type = "text",
  placeholder,
  required,
  className,
  rows = 3,
}: TFormInputProps<T>) {
  return (
    <div className={className}>
      {label && (
        <FormLabel className="mb-1 block text-sm">
          {label} {required && <span className="text-xs text-red-600">*</span>}
        </FormLabel>
      )}

      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              {render ? (
                render(field)
              ) : type === "file" ? (
                <Input
                  type="file"
                  name={field.name}
                  multiple
                  onChange={(e) =>
                    e.target.files && field.onChange(e.target.files)
                  }
                />
              ) : type === "textarea" ? (
                <Textarea
                  placeholder={placeholder}
                  {...field}
                  rows={rows}
                  className="min-h-20 resize-y"
                />
              ) : (
                <Input
                  type={type} 
                  placeholder={placeholder} 
                  {...field}
                />
              )}
            </FormControl>

            {fieldState.error && (
              <FormMessage className="mt-1 text-[10px]">
                {fieldState.error.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}