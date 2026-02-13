"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

// --- Types ---
type ToastVariant = "success" | "error" | "warning" | "info"

interface ToastData {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

// --- Variant styles ---
const toastVariants: Record<ToastVariant, { icon: React.ReactNode; classes: string }> = {
  success: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    classes: "border-green-200 bg-green-50 text-green-800",
  },
  error: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5.333V8M8 10.667h.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    classes: "border-red-200 bg-red-50 text-red-800",
  },
  warning: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6.86 2.573L1.215 12a1.333 1.333 0 001.14 2h11.29a1.333 1.333 0 001.14-2L9.14 2.573a1.333 1.333 0 00-2.28 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6v2.667M8 11.333h.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    classes: "border-yellow-200 bg-yellow-50 text-yellow-800",
  },
  info: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10.667V8M8 5.333h.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    classes: "border-blue-200 bg-blue-50 text-blue-800",
  },
}

// --- Global store ---
type ToastListener = () => void

let toasts: ToastData[] = []
let listeners: ToastListener[] = []
let idCounter = 0

function emitChange() {
  listeners.forEach((l) => l())
}

function addToast(t: Omit<ToastData, "id">) {
  const id = `toast-${++idCounter}`
  toasts = [...toasts, { ...t, id }]
  emitChange()
  return id
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  emitChange()
}

function useToastStore() {
  const [, forceUpdate] = React.useState(0)
  React.useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])
  return toasts
}

// --- Imperative toast function ---
interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

function toast(options: ToastOptions) {
  return addToast({
    variant: options.variant || "info",
    title: options.title,
    description: options.description,
    duration: options.duration ?? 5000,
  })
}

toast.success = (title: string, options?: Omit<ToastOptions, "title" | "variant">) =>
  addToast({ variant: "success", title, ...options, duration: options?.duration ?? 5000 })

toast.error = (title: string, options?: Omit<ToastOptions, "title" | "variant">) =>
  addToast({ variant: "error", title, ...options, duration: options?.duration ?? 5000 })

toast.warning = (title: string, options?: Omit<ToastOptions, "title" | "variant">) =>
  addToast({ variant: "warning", title, ...options, duration: options?.duration ?? 5000 })

toast.info = (title: string, options?: Omit<ToastOptions, "title" | "variant">) =>
  addToast({ variant: "info", title, ...options, duration: options?.duration ?? 5000 })

// --- useToast hook ---
function useToast() {
  return { toast, dismiss: removeToast }
}

// --- Single Toast Item ---
function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: (id: string) => void }) {
  const { icon, classes } = toastVariants[data.variant]
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  React.useEffect(() => {
    if (data.duration && data.duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onDismiss(data.id), 200)
      }, data.duration)
      return () => clearTimeout(timer)
    }
  }, [data.duration, data.id, onDismiss])

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-200",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        classes
      )}
      role="alert"
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{data.title}</p>
        {data.description && (
          <p className="mt-1 text-sm opacity-80">{data.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(data.id), 200)
        }}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

// --- Toast Provider ---
function ToastProvider({ children }: { children: React.ReactNode }) {
  const currentToasts = useToastStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {children}
      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed bottom-0 right-0 z-[100] flex flex-col-reverse gap-2 p-4 sm:max-w-sm w-full"
            aria-live="polite"
          >
            {currentToasts.map((t) => (
              <ToastItem key={t.id} data={t} onDismiss={removeToast} />
            ))}
          </div>,
          document.body
        )}
    </>
  )
}

export { ToastProvider, useToast, toast }
export type { ToastVariant, ToastData, ToastOptions }
