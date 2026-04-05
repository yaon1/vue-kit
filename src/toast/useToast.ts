import { readonly, shallowReactive } from 'vue'

export type ToastKind = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  kind?: ToastKind
  /** Milliseconds before auto-dismiss; 0 keeps the toast until closed. */
  duration?: number
  action?: { label: string; onClick: () => void }
}

export interface Toast extends Required<Omit<ToastOptions, 'action'>> {
  id: number
  message: string
  action?: ToastOptions['action']
}

const toasts = shallowReactive<Toast[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 1
/** Oldest toasts are dropped beyond this many, so a burst of errors can't fill the screen. */
const MAX_VISIBLE = 5

const remaining = new Map<number, { left: number; startedAt: number }>()

/** Stops the auto-dismiss timer, e.g. while the user hovers or focuses the toast. */
function pause(id: number): void {
  const entry = remaining.get(id)
  if (!entry || !timers.has(id)) return
  clearTimeout(timers.get(id))
  timers.delete(id)
  entry.left -= Date.now() - entry.startedAt
}

function resume(id: number): void {
  const entry = remaining.get(id)
  if (!entry || timers.has(id)) return
  entry.startedAt = Date.now()
  timers.set(
    id,
    setTimeout(() => dismiss(id), Math.max(0, entry.left)),
  )
}

function dismiss(id: number): void {
  remaining.delete(id)
  clearTimeout(timers.get(id))
  timers.delete(id)
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

function show(message: string, options: ToastOptions = {}): number {
  const toast: Toast = {
    id: nextId++,
    message,
    kind: options.kind ?? 'info',
    duration: options.duration ?? (options.kind === 'error' ? 0 : 4000),
    action: options.action,
  }
  toasts.push(toast)
  while (toasts.length > MAX_VISIBLE) dismiss(toasts[0]!.id)
  if (toast.duration > 0) {
    remaining.set(toast.id, { left: toast.duration, startedAt: Date.now() })
    timers.set(
      toast.id,
      setTimeout(() => dismiss(toast.id), toast.duration),
    )
  }
  return toast.id
}

/**
 * Shows a pending toast that turns into success or error when the promise settles.
 * Resolves/rejects with the original promise result.
 */
async function promise<R>(
  task: Promise<R>,
  messages: { loading: string; success: string | ((r: R) => string); error: string | ((e: unknown) => string) },
): Promise<R> {
  const id = show(messages.loading, { duration: 0 })
  try {
    const result = await task
    dismiss(id)
    show(typeof messages.success === 'function' ? messages.success(result) : messages.success, { kind: 'success' })
    return result
  } catch (error) {
    dismiss(id)
    show(typeof messages.error === 'function' ? messages.error(error) : messages.error, { kind: 'error' })
    throw error
  }
}

function clear(): void {
  for (const t of [...toasts]) dismiss(t.id)
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    show,
    dismiss,
    clear,
    promise,
    pause,
    resume,
    success: (message: string, o?: Omit<ToastOptions, 'kind'>) => show(message, { ...o, kind: 'success' }),
    error: (message: string, o?: Omit<ToastOptions, 'kind'>) => show(message, { ...o, kind: 'error' }),
  }
}
