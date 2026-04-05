import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkEmptyState from './VkEmptyState.vue'

it('renders title, description and actions', () => {
  const w = mount(VkEmptyState, {
    props: { title: 'Пока нет заказов', description: 'Они появятся здесь', icon: '📦' },
    slots: { default: '<button>Создать</button>' },
  })
  expect(w.get('h3').text()).toBe('Пока нет заказов')
  expect(w.get('.vk-empty__icon').attributes('aria-hidden')).toBe('true')
  expect(w.get('.vk-empty__actions button').text()).toBe('Создать')
})
