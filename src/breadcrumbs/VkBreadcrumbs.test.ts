import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkBreadcrumbs from './VkBreadcrumbs.vue'

it('links ancestors and marks the current page', () => {
  const w = mount(VkBreadcrumbs, { props: { items: [{ label: 'Главная', href: '/' }, { label: 'Заказы', href: '/orders' }, { label: '№ 42', href: '/orders/42' }] } })
  expect(w.findAll('a').map((a) => a.text())).toEqual(['Главная', 'Заказы'])
  expect(w.get('[aria-current=page]').text()).toBe('№ 42')
  expect(w.get('nav').attributes('aria-label')).toBe('Breadcrumb')
})
