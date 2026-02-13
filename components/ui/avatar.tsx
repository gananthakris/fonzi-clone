"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
} as const

const statusSizes = {
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-2",
  lg: "h-3 w-3 border-2",
  xl: "h-3.5 w-3.5 border-2",
} as const

export type AvatarSize = keyof typeof avatarSizes
export type AvatarStatus = keyof typeof statusColors

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: AvatarSize
  status?: AvatarStatus
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, size = "md", status, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)
    const showImage = src && !imgError

    const initials = React.useMemo(() => {
      if (fallback) return fallback.slice(0, 2).toUpperCase()
      if (alt) {
        return alt
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      }
      return "?"
    }, [fallback, alt])

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0", className)}
        {...props}
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600 overflow-hidden",
            avatarSizes[size]
          )}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-white",
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
