import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/** Calls `handler` on pointerdown outside every given element. */
export function useClickOutside(targets: Ref<HTMLElement | undefined>[], handler: (event: PointerEvent) => void): void {
  const listener = (event: PointerEvent) => {
    const path = event.composedPath()
    if (targets.every((t) => !t.value || !path.includes(t.value))) handler(event)
  }
  onMounted(() => document.addEventListener('pointerdown', listener, true))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener, true))
}
