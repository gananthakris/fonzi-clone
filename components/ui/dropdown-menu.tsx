"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// --- Context ---
interface DropdownMenuContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext() {
  const ctx = React.useContext(DropdownMenuContext)
  if (!ctx) throw new Error("DropdownMenu compound components must be used within <DropdownMenu>")
  return ctx
}

// --- Root ---
interface DropdownMenuProps {
  children: React.ReactNode
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

// --- Trigger ---
interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useDropdownMenuContext()

  return (
    <button
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      type="button"
      aria-expanded={open}
      aria-haspopup="true"
      onClick={(e) => {
        onClick?.(e)
        setOpen((prev) => !prev)
      }}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

// --- Content ---
interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end"
  sideOffset?: number
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = "end", children, ...props }, ref) => {
  const { open, setOpen } = useDropdownMenuContext()
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const [focusIndex, setFocusIndex] = React.useState(-1)

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    // Delay to avoid closing immediately on trigger click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open, setOpen])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return
    const menu = menuRef.current
    if (!menu) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
      const count = items.length
      if (!count) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setFocusIndex((prev) => {
            const next = prev < count - 1 ? prev + 1 : 0
            items[next]?.focus()
            return next
          })
          break
        case "ArrowUp":
          e.preventDefault()
          setFocusIndex((prev) => {
            const next = prev > 0 ? prev - 1 : count - 1
            items[next]?.focus()
            return next
          })
          break
        case "Escape":
          e.preventDefault()
          setOpen(false)
          break
        case "Home":
          e.preventDefault()
          setFocusIndex(0)
          items[0]?.focus()
          break
        case "End":
          e.preventDefault()
          setFocusIndex(count - 1)
          items[count - 1]?.focus()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, setOpen])

  // Reset focus index when closed
  React.useEffect(() => {
    if (!open) setFocusIndex(-1)
  }, [open])

  if (!open) return null

  return (
    <div
      ref={(node) => {
        menuRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      role="menu"
      className={cn(
        "absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

// --- Item ---
interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  destructive?: boolean
}

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, icon, destructive = false, children, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext()

  return (
    <button
      ref={ref}
      role="menuitem"
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors focus:bg-gray-100",
        destructive
          ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
          : "text-gray-700 hover:bg-gray-100",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {icon && <span className="shrink-0 text-current opacity-60">{icon}</span>}
      {children}
    </button>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

// --- Divider ---
function DropdownMenuDivider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
    />
  )
}

// --- Label ---
function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("px-2.5 py-1.5 text-xs font-medium text-gray-500", className)}>
      {children}
    </div>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuDivider,
  DropdownMenuLabel,
}
