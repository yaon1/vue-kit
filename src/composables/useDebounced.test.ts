import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useDebounced } from './useDebounced'

it('calls once with the last arguments after the wait', () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  let search!: (q: string) => void
  const w = mount(defineComponent(() => ((search = useDebounced(fn, 300)), () => null)))

  search('a')
  search('ab')
  vi.advanceTimersByTime(299)
  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(fn).toHaveBeenCalledExactlyOnceWith('ab')

  search('abc')
  w.unmount()
  vi.runAllTimers()
  expect(fn).toHaveBeenCalledOnce()
  vi.useRealTimers()
})
