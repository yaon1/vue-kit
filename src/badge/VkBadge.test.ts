import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkBadge from './VkBadge.vue'

it('renders tone and optional dot', () => {
  const w = mount(VkBadge, { props: { tone: 'success', dot: true }, slots: { default: 'Активен' } })
  expect(w.classes()).toContain('vk-badge--success')
  expect(w.find('.vk-badge__dot').exists()).toBe(true)
  expect(w.text()).toBe('Активен')
})
