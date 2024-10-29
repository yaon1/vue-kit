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

function dismiss(id: number): void {
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
  if (toast.duration > 0) timers.set(toast.id, setTimeout(() => dismiss(toast.id), toast.duration))
  return toast.id
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
    success: (message: string, o?: Omit<ToastOptions, 'kind'>) => show(message, { ...o, kind: 'success' }),
    error: (message: string, o?: Omit<ToastOptions, 'kind'>) => show(message, { ...o, kind: 'error' }),
  }
}
