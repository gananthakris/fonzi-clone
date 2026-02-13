"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TooltipPosition = "top" | "bottom" | "left" | "right"

const positionClasses: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const arrowClasses: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800",
  left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800",
  right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800",
}

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: TooltipPosition
  delay?: number
  className?: string
}

function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
  className,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false)
  const [shouldRender, setShouldRender] = React.useState(false)
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = React.useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    showTimer.current = setTimeout(() => {
      setShouldRender(true)
      // Small delay for enter animation
      requestAnimationFrame(() => setVisible(true))
    }, delay)
  }, [delay])

  const hide = React.useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current)
      showTimer.current = null
    }
    setVisible(false)
    hideTimer.current = setTimeout(() => {
      setShouldRender(false)
    }, 150) // match transition duration
  }, [])

  React.useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {shouldRender && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 max-w-xs whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-150",
            positionClasses[position],
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
            className
          )}
        >
          {content}
          {/* Arrow */}
          <span
            className={cn(
              "absolute h-0 w-0 border-4",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  )
}

export { Tooltip }
