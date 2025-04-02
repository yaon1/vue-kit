import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkPagination from './VkPagination.vue'

it('marks the current page and navigates', async () => {
  const w = mount(VkPagination, { props: { total: 10, modelValue: 5, 'onUpdate:modelValue': () => {} } })
  expect(w.get('[aria-current=page]').text()).toBe('5')
  expect(w.findAll('.vk-pagination__gap')).toHaveLength(2)

  await w.get('[aria-label="Next page"]').trigger('click')
  await w.get('[aria-label="Page 10"]').trigger('click')
  expect(w.emitted('update:modelValue')).toEqual([[6], [10]])
})

it('disables edges and hides for a single page', async () => {
  const w = mount(VkPagination, { props: { total: 3, modelValue: 1 } })
  expect(w.get('[aria-label="Previous page"]').attributes('disabled')).toBeDefined()
  await w.setProps({ total: 1 })
  expect(w.find('nav').exists()).toBe(false)
})
