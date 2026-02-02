import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { nextTick } from 'vue'
import VkMenu from './VkMenu.vue'

const items = [
  { key: 'edit', label: 'Редактировать' },
  { key: 'archive', label: 'Архивировать', disabled: true },
  { key: 'delete', label: 'Удалить', danger: true },
]

function setup() {
  return mount(VkMenu, { props: { items, label: 'Действия' }, attachTo: document.body })
}

it('opens from the keyboard and focuses the first item', async () => {
  const w = setup()
  await w.get('.vk-menu__trigger').trigger('keydown', { key: 'ArrowDown' })
  await nextTick()
  expect(w.get('.vk-menu__trigger').attributes('aria-expanded')).toBe('true')
  expect(document.activeElement?.textContent?.trim()).toBe('Редактировать')
  w.unmount()
})

it('skips disabled items with arrows and selects with Enter', async () => {
  const w = setup()
  await w.get('.vk-menu__trigger').trigger('click')
  await nextTick()
  await w.get('[role=menu]').trigger('keydown', { key: 'ArrowDown' })
  expect(document.activeElement?.textContent?.trim()).toBe('Удалить')
  await w.findAll('[role=menuitem]')[2]!.trigger('keydown', { key: 'Enter' })
  expect(w.emitted('select')).toEqual([['delete']])
  expect(w.get('.vk-menu__trigger').attributes('aria-expanded')).toBe('false')
  w.unmount()
})

it('closes on Escape and returns focus', async () => {
  const w = setup()
  await w.get('.vk-menu__trigger').trigger('click')
  await nextTick()
  await w.get('[role=menu]').trigger('keydown', { key: 'Escape' })
  expect(document.activeElement).toBe(w.get('.vk-menu__trigger').element)
  w.unmount()
})

it('renders custom item content through a slot', () => {
  const w = mount(VkMenu, { props: { items, label: 'Действия' }, slots: { item: '<template #item="{ item }">★ {{ item.label }}</template>' } })
  expect(w.findAll('[role=menuitem]')[0]!.text()).toBe('★ Редактировать')
})
