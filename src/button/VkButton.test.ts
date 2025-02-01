import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkButton from './VkButton.vue'

it('renders variant classes and emits clicks', async () => {
  const w = mount(VkButton, { props: { variant: 'primary', size: 'lg' }, slots: { default: 'Сохранить' } })
  expect(w.classes()).toEqual(expect.arrayContaining(['vk-button--primary', 'vk-button--lg']))
  expect(w.attributes('type')).toBe('button')
  await w.trigger('click')
  expect(w.emitted('click')).toHaveLength(1)
})

it('is disabled and busy while loading', () => {
  const w = mount(VkButton, { props: { loading: true }, slots: { default: 'Go' } })
  expect(w.attributes('disabled')).toBeDefined()
  expect(w.attributes('aria-busy')).toBe('true')
  expect(w.find('.vk-spinner').exists()).toBe(true)
})
