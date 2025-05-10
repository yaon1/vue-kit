import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkProgress from './VkProgress.vue'

it('exposes progressbar values and clamps the width', () => {
  const w = mount(VkProgress, { props: { label: 'Загрузка', value: 30, max: 60, showValue: true } })
  const bar = w.get('[role=progressbar]')
  expect(bar.attributes('aria-valuenow')).toBe('30')
  expect(w.get('.vk-progress__bar').attributes('style')).toContain('width: 50%')
  expect(w.get('.vk-progress__value').text()).toBe('50%')
})

it('is indeterminate without a value', () => {
  const w = mount(VkProgress, { props: { label: 'Ожидание' } })
  expect(w.get('[role=progressbar]').attributes('aria-valuenow')).toBeUndefined()
  expect(w.get('.vk-progress__bar').classes()).toContain('is-indeterminate')
})
