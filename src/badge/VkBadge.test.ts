import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkBadge from './VkBadge.vue'

it('renders tone and optional dot', () => {
  const w = mount(VkBadge, { props: { tone: 'success', dot: true }, slots: { default: 'Активен' } })
  expect(w.classes()).toContain('vk-badge--success')
  expect(w.find('.vk-badge__dot').exists()).toBe(true)
  expect(w.text()).toBe('Активен')
})

it('caps counts with max', () => {
  expect(mount(VkBadge, { props: { count: 7 } }).text()).toBe('7')
  expect(mount(VkBadge, { props: { count: 150 } }).text()).toBe('99+')
  expect(mount(VkBadge, { props: { count: 12, max: 9 } }).text()).toBe('9+')
})
