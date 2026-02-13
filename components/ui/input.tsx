"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const inputVariants = {
  default:
    "border border-gray-300 bg-white focus:border-primary focus:ring-primary/20",
  filled:
    "border border-transparent bg-gray-100 focus:bg-white focus:border-primary focus:ring-primary/20",
} as const

export type InputVariant = keyof typeof inputVariants

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-lg px-3 py-2 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
              inputVariants[variant],
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              leftIcon && "pl-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
