import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { h, type Component } from 'vue'
import {
  VkAccordion,
  VkAlert,
  VkButton,
  VkCombobox,
  VkDataTable,
  VkInput,
  VkMenu,
  VkPagination,
  VkProgress,
  VkSwitch,
  VkTabs,
} from './index'

// Runs axe-core against rendered components; color-contrast needs real layout, so it's skipped in jsdom.
async function violations(component: Component, props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(component, { props, slots, attachTo: document.body })
  const result = await axe.run(wrapper.element, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } })
  wrapper.unmount()
  return result.violations.map((v) => `${v.id}: ${v.help}`)
}

describe('accessibility', () => {
  it('button', async () => {
    expect(await violations(VkButton, {}, { default: () => 'Save' })).toEqual([])
  })

  it('input with error', async () => {
    expect(await violations(VkInput, { label: 'Email', error: 'Required' })).toEqual([])
  })

  it('combobox', async () => {
    expect(await violations(VkCombobox, { options: ['a', 'b'], label: 'Letter' })).toEqual([])
  })

  it('tabs', async () => {
    const tabs = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
    ]
    expect(await violations(VkTabs, { tabs, label: 'Sections', modelValue: 'a' }, { a: () => h('p', 'Panel A') })).toEqual([])
  })

  it('pagination', async () => {
    expect(await violations(VkPagination, { total: 12, modelValue: 4 })).toEqual([])
  })

  it('data table', async () => {
    const rows = [{ id: 1, name: 'Ada' }]
    expect(
      await violations(VkDataTable as unknown as Component, {
        rows,
        rowKey: 'id',
        caption: 'People',
        columns: [{ key: 'name', label: 'Name', sortable: true }],
      }),
    ).toEqual([])
  })

  it('switch', async () => {
    expect(await violations(VkSwitch, { label: 'Notifications' })).toEqual([])
  })

  it('accordion', async () => {
    expect(await violations(VkAccordion, { items: [{ key: 'q', title: 'Question' }], modelValue: ['q'] }, { q: () => 'Answer' })).toEqual(
      [],
    )
  })

  it('menu', async () => {
    expect(await violations(VkMenu, { label: 'Actions', items: [{ key: 'e', label: 'Edit' }] })).toEqual([])
  })

  it('progress and alert', async () => {
    expect(await violations(VkProgress, { label: 'Upload', value: 40 })).toEqual([])
    expect(await violations(VkAlert, { tone: 'danger', title: 'Error' }, { default: () => 'Failed' })).toEqual([])
  })
})
