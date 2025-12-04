import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkAvatar from './VkAvatar.vue'

it('falls back to initials when the image fails', async () => {
  const w = mount(VkAvatar, { props: { name: 'ада лавлейс', src: '/broken.png' } })
  expect(w.get('img').attributes('alt')).toBe('ада лавлейс')
  await w.get('img').trigger('error')
  expect(w.get('[role=img]').text()).toBe('АЛ')
})

it('gives the same name the same colour', () => {
  const a = mount(VkAvatar, { props: { name: 'Bob' } }).attributes('style')
  const b = mount(VkAvatar, { props: { name: 'Bob' } }).attributes('style')
  expect(a).toBe(b)
})
