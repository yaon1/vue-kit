import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useClickOutside } from './useClickOutside'

it('fires only for clicks outside the target', async () => {
  const handler = vi.fn()
  const wrapper = mount(
    defineComponent(() => {
      const box = ref<HTMLElement>()
      useClickOutside([box], handler)
      return () => h('div', [h('button', { ref: box, id: 'inside' }), h('span', { id: 'outside' })])
    }),
    { attachTo: document.body },
  )

  wrapper.get('#inside').element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
  expect(handler).not.toHaveBeenCalled()
  wrapper.get('#outside').element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
  expect(handler).toHaveBeenCalledOnce()
  wrapper.unmount()
})
