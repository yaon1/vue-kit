import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkAlert from './VkAlert.vue'

it('uses role=alert only for danger', () => {
  expect(mount(VkAlert, { props: { tone: 'danger' } }).attributes('role')).toBe('alert')
  expect(mount(VkAlert, { props: { tone: 'info' } }).attributes('role')).toBe('status')
})

it('renders title and emits dismiss', async () => {
  const w = mount(VkAlert, { props: { title: 'Готово', dismissible: true }, slots: { default: 'Изменения сохранены' } })
  expect(w.get('.vk-alert__title').text()).toBe('Готово')
  await w.get('.vk-alert__close').trigger('click')
  expect(w.emitted('dismiss')).toHaveLength(1)
})
