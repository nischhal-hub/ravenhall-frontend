"use client"

import * as React from "react"
import { Eye, EyeOff, Lock, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { authInputClass } from "./auth-input"

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Show the lock icon on the left (auth screens) */
  withIcon?: boolean
  /** Extra classes for the input element */
  inputClassName?: string
}

/**
 * Password field with a show/hide toggle and a Caps Lock warning.
 * The value is never stored here; it stays in the form library's state.
 * Visibility resets to hidden when the owning form submits and on unmount.
 */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      className,
      inputClassName,
      withIcon = false,
      id,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const capsId = `${inputId}-caps`
    const [visible, setVisible] = React.useState(false)
    const [capsLock, setCapsLock] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const selection = React.useRef<{
      start: number | null
      end: number | null
    } | null>(null)

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )

    // Hide again whenever the surrounding form is submitted
    React.useEffect(() => {
      const form = inputRef.current?.form
      if (!form) return
      const hide = () => setVisible(false)
      form.addEventListener("submit", hide)
      return () => form.removeEventListener("submit", hide)
    }, [])

    // Switching type resets the caret in some browsers; put it back. Only when
    // the input had focus (mouse/touch toggle): a keyboard user stays on the button.
    React.useLayoutEffect(() => {
      const input = inputRef.current
      const saved = selection.current
      if (!input || !saved) return
      selection.current = null
      input.focus()
      if (saved.start !== null && saved.end !== null) {
        input.setSelectionRange(saved.start, saved.end)
      }
    }, [visible])

    const toggle = () => {
      const input = inputRef.current
      selection.current =
        input && document.activeElement === input
          ? { start: input.selectionStart, end: input.selectionEnd }
          : null
      setVisible((v) => !v)
    }

    const updateCaps = (event: React.KeyboardEvent<HTMLInputElement>) => {
      setCapsLock(event.getModifierState?.("CapsLock") ?? false)
    }

    return (
      <div className={className}>
        <div className="relative">
          {withIcon && (
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
          )}
          <input
            {...props}
            ref={setRefs}
            id={inputId}
            type={visible ? "text" : "password"}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby={
              [props["aria-describedby"], capsLock ? capsId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onKeyDown={(e) => {
              updateCaps(e)
              onKeyDown?.(e)
            }}
            onKeyUp={(e) => {
              updateCaps(e)
              onKeyUp?.(e)
            }}
            onBlur={(e) => {
              setCapsLock(false)
              onBlur?.(e)
            }}
            className={cn(
              authInputClass,
              withIcon && "pl-10",
              "pr-12",
              inputClassName
            )}
          />
          <button
            type="button"
            onClick={toggle}
            // Keep focus in the input when clicking the toggle with a mouse
            onMouseDown={(e) => e.preventDefault()}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            aria-controls={inputId}
            disabled={props.disabled}
            className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-50 motion-reduce:transition-none sm:size-10"
          >
            {visible ? (
              <EyeOff className="size-4.5" aria-hidden />
            ) : (
              <Eye className="size-4.5" aria-hidden />
            )}
          </button>
        </div>
        {capsLock && (
          <p
            id={capsId}
            role="status"
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400"
          >
            <TriangleAlert className="size-3.5" aria-hidden />
            Caps Lock is on
          </p>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"
