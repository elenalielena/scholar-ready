import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Dialog({ open, title, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus()
      return
    }

    triggerRef.current = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const firstFocusable = dialog?.querySelector<HTMLElement>(focusableSelector)
    firstFocusable?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) {
        return
      }

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-md rounded-xl bg-white p-6 text-ink shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="dialog-title" className="text-xl font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-md px-3 text-sm font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
