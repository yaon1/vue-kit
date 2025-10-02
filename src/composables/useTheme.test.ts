import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useTheme } from './useTheme'

it('applies and persists an explicit theme, and clears it for system', async () => {
  let api!: ReturnType<typeof useTheme>
  mount(defineComponent(() => ((api = useTheme()), () => null)))

  api.set('dark')
  await nextTick()
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  expect(localStorage.getItem('vk-theme')).toBe('dark')
  expect(api.resolved.value).toBe('dark')

  api.set('system')
  await nextTick()
  expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  expect(localStorage.getItem('vk-theme')).toBeNull()
})
