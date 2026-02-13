"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      label,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked
    const switchId = id || React.useId()

    const toggle = React.useCallback(() => {
      if (disabled) return
      const next = !isChecked
      if (!isControlled) setUncontrolledChecked(next)
      onCheckedChange?.(next)
    }, [disabled, isChecked, isControlled, onCheckedChange])

    const switchButton = (
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-primary" : "bg-gray-300",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
            isChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    )

    if (label) {
      return (
        <div className="flex items-center gap-2.5">
          {switchButton}
          <label
            htmlFor={switchId}
            className={cn(
              "text-sm font-medium text-gray-700",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        </div>
      )
    }

    return switchButton
  }
)
Switch.displayName = "Switch"

export { Switch }
