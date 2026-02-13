import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  circle?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, circle = false, style, ...props }, ref) => {
    const sizeStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
      ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-gray-200",
          circle ? "rounded-full" : "rounded-md",
          className
        )}
        style={sizeStyle}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// --- Convenience components ---

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  lineHeight?: string | number
  gap?: string | number
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, lineHeight = 16, gap = 8, ...props }, ref) => {
    const gapValue = typeof gap === "number" ? `${gap}px` : gap

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ display: "flex", flexDirection: "column", gap: gapValue }}
        aria-hidden="true"
        {...props}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={lineHeight}
            className={cn(
              "w-full",
              i === lines - 1 && "w-3/4" // Last line shorter
            )}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = "SkeletonText"

interface SkeletonCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

const SkeletonCircle = React.forwardRef<HTMLDivElement, SkeletonCircleProps>(
  ({ size = 40, className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      circle
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
)
SkeletonCircle.displayName = "SkeletonCircle"

export { Skeleton, SkeletonText, SkeletonCircle }
