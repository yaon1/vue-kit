import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VkCombobox from './VkCombobox.vue'

const fruits = ['Apple', 'Apricot', 'Banana', 'Cherry']

function setup(modelValue: string | null = null) {
  return mount(VkCombobox<string>, {
    props: { options: fruits, label: 'Fruit', modelValue, 'onUpdate:modelValue': () => {} },
    attachTo: document.body,
  })
}

describe('VkCombobox', () => {
  it('filters options case-insensitively', async () => {
    const w = setup()
    await w.get('input').setValue('ap')
    expect(w.findAll('[role=option]').map((o) => o.text())).toEqual(['Apple', 'Apricot'])
    w.unmount()
  })

  it('selects with keyboard and wires aria-activedescendant', async () => {
    const w = setup()
    const input = w.get('input')
    await input.setValue('a')
    await input.trigger('keydown', { key: 'ArrowDown' })
    const activeId = input.attributes('aria-activedescendant')
    expect(w.get(`[id="${activeId}"]`).text()).toBe('Apricot')
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['Apricot'])
    expect(input.attributes('aria-expanded')).toBe('false')
    w.unmount()
  })

  it('reverts unmatched text on blur', async () => {
    const w = setup('Cherry')
    const input = w.get('input')
    await input.setValue('zzz')
    expect(w.find('.vk-combobox__empty').exists()).toBe(true)
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('Cherry')
    w.unmount()
  })
})
