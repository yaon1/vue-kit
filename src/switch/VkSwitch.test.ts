import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkSwitch from './VkSwitch.vue'

it('is a labelled switch bound to v-model', async () => {
  const w = mount(VkSwitch, { props: { label: 'Уведомления', modelValue: false, 'onUpdate:modelValue': () => {} } })
  const input = w.get('input')
  expect(input.attributes('role')).toBe('switch')
  expect(w.get('label').text()).toContain('Уведомления')

  await input.setValue(true)
  expect(w.emitted('update:modelValue')).toEqual([[true]])
})

it('respects disabled', () => {
  const w = mount(VkSwitch, { props: { label: 'x', disabled: true } })
  expect(w.get('input').attributes('disabled')).toBeDefined()
})
