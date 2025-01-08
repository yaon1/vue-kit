import { nextTick, watch, type Ref } from 'vue'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('inert'))
}

/**
 * While `active` is true, Tab cycles inside `root`; on deactivate focus returns
 * to whatever had it before.
 */
export function useFocusTrap(root: Ref<HTMLElement | undefined>, active: Ref<boolean>): void {
  let previous: HTMLElement | null = null

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !root.value) return
    const items = focusableIn(root.value)
    if (items.length === 0) return event.preventDefault()
    const first = items[0]!
    const last = items[items.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(
    active,
    async (on) => {
      if (on) {
        previous = document.activeElement as HTMLElement | null
        await nextTick()
        root.value?.addEventListener('keydown', onKeydown)
        ;(root.value && focusableIn(root.value)[0])?.focus()
      } else {
        root.value?.removeEventListener('keydown', onKeydown)
        previous?.focus()
      }
    },
    { immediate: true },
  )
}
