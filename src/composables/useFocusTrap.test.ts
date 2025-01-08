import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useFocusTrap } from './useFocusTrap'

it('focuses the first element, wraps Tab and restores focus', async () => {
  const active = ref(false)
  const wrapper = mount(
    defineComponent(() => {
      const root = ref<HTMLElement>()
      useFocusTrap(root, active)
      return () => h('div', [h('button', { id: 'opener' }), h('div', { ref: root }, [h('button', { id: 'a' }), h('button', { id: 'b' })])])
    }),
    { attachTo: document.body },
  )
  const opener = wrapper.get('#opener').element as HTMLElement
  opener.focus()

  active.value = true
  await nextTick()
  await nextTick()
  expect(document.activeElement?.id).toBe('a')

  ;(wrapper.get('#b').element as HTMLElement).focus()
  await wrapper.get('#b').trigger('keydown', { key: 'Tab' })
  expect(document.activeElement?.id).toBe('a')

  active.value = false
  await nextTick()
  expect(document.activeElement).toBe(opener)
  wrapper.unmount()
})
