import * as React from "react"
import { cn } from "@/lib/utils"

const progressColors = {
  primary: "bg-primary",
  purple: "bg-purple",
  accent: "bg-accent",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
} as const

const progressSizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
} as const

export type ProgressColor = keyof typeof progressColors
export type ProgressSize = keyof typeof progressSizes

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  color?: ProgressColor
  size?: ProgressSize
  label?: string
  showValue?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      color = "primary",
      size = "md",
      label,
      showValue = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(label || showValue) && (
          <div className="mb-1.5 flex items-center justify-between">
            {label && (
              <span className="text-sm font-medium text-gray-700">{label}</span>
            )}
            {showValue && (
              <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
            )}
          </div>
        )}
        <div
          className={cn(
            "w-full overflow-hidden rounded-full bg-gray-200",
            progressSizes[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              progressColors[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
