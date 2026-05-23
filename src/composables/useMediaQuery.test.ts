import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useMediaQuery } from './useMediaQuery'

it('tracks matchMedia changes', () => {
  let listener: ((e: { matches: boolean }) => void) | undefined
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: (_: string, l: typeof listener) => (listener = l), removeEventListener: vi.fn() }))
  let result!: ReturnType<typeof useMediaQuery>
  mount(defineComponent(() => ((result = useMediaQuery('(max-width: 600px)')), () => null)))

  expect(result.value).toBe(false)
  listener?.({ matches: true })
  expect(result.value).toBe(true)
  vi.unstubAllGlobals()
})
