import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkCheckbox from './VkCheckbox.vue'

it('reflects indeterminate as a DOM property and aria-checked=mixed', async () => {
  const w = mount(VkCheckbox, { props: { label: 'Выбрать все', indeterminate: true } })
  const input = w.get('input').element as HTMLInputElement
  expect(input.indeterminate).toBe(true)
  expect(w.get('input').attributes('aria-checked')).toBe('mixed')

  await w.setProps({ indeterminate: false })
  await w.vm.$nextTick()
  expect(input.indeterminate).toBe(false)
})
