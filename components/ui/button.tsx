"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

const buttonVariants = {
  variant: {
    primary:
      "bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    purple:
      "bg-purple text-white hover:bg-purple-600 active:bg-purple-700 shadow-sm",
    accent:
      "bg-accent text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm",
  },
  size: {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-10 px-4 text-sm rounded-lg gap-2",
    lg: "h-12 px-6 text-base rounded-lg gap-2.5",
    xl: "h-14 px-8 text-lg rounded-xl gap-3",
  },
} as const

export type ButtonVariant = keyof typeof buttonVariants.variant
export type ButtonSize = keyof typeof buttonVariants.size

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // When asChild is true, render children only (Slot requires single child)
    if (asChild) {
      return (
        <Slot
          className={cn(
            "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            buttonVariants.variant[variant],
            buttonVariants.size[size],
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Spinner size="sm" className="shrink-0" />}
        {!loading && leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
