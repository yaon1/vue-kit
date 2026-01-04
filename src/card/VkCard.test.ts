import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkCard from './VkCard.vue'

it('renders the chosen element and optional regions', () => {
  const w = mount(VkCard, { props: { as: 'article' }, slots: { header: 'Тариф', default: '990 ₽/мес' } })
  expect(w.element.tagName).toBe('ARTICLE')
  expect(w.get('.vk-card__header').text()).toBe('Тариф')
  expect(w.find('.vk-card__footer').exists()).toBe(false)
})
