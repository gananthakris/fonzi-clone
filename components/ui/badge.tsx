import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  variant: {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary/10 text-primary-700",
    purple: "bg-purple/10 text-purple-700",
    accent: "bg-accent/10 text-accent-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-700",
    outline: "bg-transparent border border-gray-300 text-gray-700",
  },
  size: {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
  },
} as const

export type BadgeVariant = keyof typeof badgeVariants.variant
export type BadgeSize = keyof typeof badgeVariants.size

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
