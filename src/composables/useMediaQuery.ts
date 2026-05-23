import { onBeforeUnmount, ref, type Ref } from 'vue'

/** Reactive `matchMedia`, e.g. `useMediaQuery('(max-width: 600px)')`. */
export function useMediaQuery(query: string): Ref<boolean> {
  const mql = typeof matchMedia === 'function' ? matchMedia(query) : null
  const matches = ref(mql?.matches ?? false)
  const update = (e: MediaQueryListEvent) => (matches.value = e.matches)
  mql?.addEventListener?.('change', update)
  onBeforeUnmount(() => mql?.removeEventListener?.('change', update))
  return matches
}
