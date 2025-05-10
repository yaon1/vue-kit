import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkSkeleton from './VkSkeleton.vue'

it('renders hidden placeholder lines with a shorter last line', () => {
  const w = mount(VkSkeleton, { props: { lines: 3 } })
  const lines = w.findAll('.vk-skeleton__line')
  expect(w.attributes('aria-hidden')).toBe('true')
  expect(lines).toHaveLength(3)
  expect(lines[2]!.attributes('style')).toContain('width: 60%')
})
