import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkTabs from './VkTabs.vue'

const tabs = [
  { key: 'general', label: 'Общие' },
  { key: 'billing', label: 'Оплата', disabled: true },
  { key: 'security', label: 'Безопасность' },
]

function setup() {
  return mount(VkTabs, {
    props: { tabs, label: 'Настройки', modelValue: 'general', 'onUpdate:modelValue': () => {} },
    slots: { general: 'General panel', security: 'Security panel' },
    attachTo: document.body,
  })
}

it('links tabs and panels and renders only the active panel', () => {
  const w = setup()
  const tab = w.get('[role=tab][aria-selected=true]')
  const panel = w.get('[role=tabpanel]')
  expect(panel.text()).toBe('General panel')
  expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
  expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
  w.unmount()
})

it('moves with arrow keys, skipping disabled tabs', async () => {
  const w = setup()
  await w.get('[role=tablist]').trigger('keydown', { key: 'ArrowRight' })
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['security'])
  await w.setProps({ modelValue: 'security' })
  await w.get('[role=tablist]').trigger('keydown', { key: 'ArrowRight' })
  expect(w.emitted('update:modelValue')?.[1]).toEqual(['general'])
  w.unmount()
})

it('uses up/down arrows when vertical', async () => {
  const w = mount(VkTabs, {
    props: { tabs, label: 'Настройки', orientation: 'vertical', modelValue: 'general', 'onUpdate:modelValue': () => {} },
  })
  expect(w.get('[role=tablist]').attributes('aria-orientation')).toBe('vertical')
  await w.get('[role=tablist]').trigger('keydown', { key: 'ArrowRight' })
  expect(w.emitted('update:modelValue')).toBeUndefined()
  await w.get('[role=tablist]').trigger('keydown', { key: 'ArrowDown' })
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['security'])
})
