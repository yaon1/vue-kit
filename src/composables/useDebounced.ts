import { onBeforeUnmount } from 'vue'

/** Debounces a function; pending calls are cancelled on unmount. */
export function useDebounced<A extends unknown[]>(fn: (...args: A) => void, wait = 250): ((...args: A) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined
  const debounced = Object.assign(
    (...args: A) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), wait)
    },
    { cancel: () => clearTimeout(timer) },
  )
  onBeforeUnmount(debounced.cancel)
  return debounced
}
