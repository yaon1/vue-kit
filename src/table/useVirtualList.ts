import { computed, ref, type Ref } from 'vue'

/** Fixed-row-height windowing: renders only rows inside the viewport plus overscan. */
export function useVirtualList(count: Ref<number>, rowHeight: number, viewportHeight: Ref<number>, overscan = 6) {
  const scrollTop = ref(0)

  const range = computed(() => {
    const start = Math.max(0, Math.floor(scrollTop.value / rowHeight) - overscan)
    const visible = Math.ceil(viewportHeight.value / rowHeight) + overscan * 2
    return { start, end: Math.min(count.value, start + visible) }
  })

  return {
    scrollTop,
    range,
    totalHeight: computed(() => count.value * rowHeight),
    offset: computed(() => range.value.start * rowHeight),
  }
}
