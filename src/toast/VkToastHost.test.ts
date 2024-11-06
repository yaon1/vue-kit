import { mount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import VkToastHost from './VkToastHost.vue'
import { useToast } from './useToast'

const t = useToast()
afterEach(() => t.clear())

it('renders errors as assertive alerts and runs actions', async () => {
  const wrapper = mount(VkToastHost)
  const undo = vi.fn()
  t.error('Failed', { action: { label: 'Retry', onClick: undo } })
  await nextTick()

  const toast = wrapper.get('.vk-toast')
  expect(toast.attributes('role')).toBe('alert')
  await toast.get('.vk-toast__action').trigger('click')
  expect(undo).toHaveBeenCalledOnce()
  expect(t.toasts).toHaveLength(0)
})
