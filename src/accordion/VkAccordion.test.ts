import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkAccordion from './VkAccordion.vue'

const items = [
  { key: 'pay', title: 'Как оплатить?' },
  { key: 'refund', title: 'Как вернуть деньги?' },
]

it('opens one panel at a time by default', async () => {
  const w = mount(VkAccordion, { props: { items, modelValue: ['pay'], 'onUpdate:modelValue': () => {} } })
  await w.findAll('button')[1]!.trigger('click')
  expect(w.emitted('update:modelValue')?.[0]).toEqual([['refund']])
})

it('allows several open panels with multiple', async () => {
  const w = mount(VkAccordion, { props: { items, multiple: true, modelValue: ['pay'], 'onUpdate:modelValue': () => {} } })
  await w.findAll('button')[1]!.trigger('click')
  expect(w.emitted('update:modelValue')?.[0]).toEqual([['pay', 'refund']])
})

it('wires aria-expanded and controls', () => {
  const w = mount(VkAccordion, { props: { items, modelValue: ['pay'] } })
  const trigger = w.findAll('button')[0]!
  expect(trigger.attributes('aria-expanded')).toBe('true')
  expect(w.get(`[id="${trigger.attributes('aria-controls')}"]`).attributes('role')).toBe('region')
})
