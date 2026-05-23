import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useVirtualList } from './useVirtualList'

describe('useVirtualList', () => {
  it('renders the visible window plus overscan', () => {
    const list = useVirtualList(ref(1000), 20, ref(200), 5)
    expect(list.range.value).toEqual({ start: 0, end: 20 })
    expect(list.totalHeight.value).toBe(20_000)

    list.scrollTop.value = 2000
    expect(list.range.value).toEqual({ start: 95, end: 115 })
    expect(list.offset.value).toBe(1900)
  })

  it('never runs past the end', () => {
    const list = useVirtualList(ref(10), 20, ref(200), 5)
    list.scrollTop.value = 1000
    expect(list.range.value.end).toBe(10)
  })
})
