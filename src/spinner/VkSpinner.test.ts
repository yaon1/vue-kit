import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkSpinner from './VkSpinner.vue'

it('is announced as a status with a label', () => {
  const w = mount(VkSpinner, { props: { size: 24, label: 'Сохранение' } })
  expect(w.attributes('role')).toBe('status')
  expect(w.attributes('aria-label')).toBe('Сохранение')
  expect(w.attributes('style')).toContain('width: 24px')
})
