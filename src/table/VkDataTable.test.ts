import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkDataTable from './VkDataTable.vue'

type Row = { id: number; name: string; score: number }
const rows: Row[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i, name: `User ${i}`, score: (i * 37) % 101 }))
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'end' as const },
]

function setup() {
  return mount(VkDataTable<Row>, {
    props: { rows, columns, rowKey: 'id', caption: 'Users', height: 400, rowHeight: 40 },
  })
}

it('renders only the visible window of rows', () => {
  const w = setup()
  const bodyRows = w.findAll('.vk-table__body [role=row]')
  expect(bodyRows.length).toBeLessThan(30)
  expect(w.get('[role=table]').attributes('aria-rowcount')).toBe('10001')
})

it('sorts on header click and exposes aria-sort', async () => {
  const w = setup()
  const header = w.findAll('[role=columnheader]')[1]!
  await header.get('button').trigger('click')
  await header.get('button').trigger('click')
  expect(header.attributes('aria-sort')).toBe('descending')
  expect(w.get('.vk-table__body [role=row] [role=cell]:last-child').text()).toBe('100')
  expect(w.emitted('update:sort')?.at(-1)).toEqual([{ key: 'score', direction: 'desc' }])
})

it('moves the window on scroll', async () => {
  const w = setup()
  const body = w.get('.vk-table__body')
  ;(body.element as HTMLElement).scrollTop = 40 * 5000
  await body.trigger('scroll')
  expect(w.get('.vk-table__body [role=row]').attributes('aria-rowindex')).toBe(String(5000 - 6 + 2))
})

it('emits rowClick with the row', async () => {
  const w = setup()
  await w.get('.vk-table__body [role=row]').trigger('click')
  expect(w.emitted('rowClick')?.[0]?.[0]).toEqual(rows[0])
})

it('selects rows and toggles all with an indeterminate header', async () => {
  const small = rows.slice(0, 3)
  const w = mount(VkDataTable<Row>, {
    props: { rows: small, columns, rowKey: 'id', caption: 'Users', selectable: true, selected: [1], 'onUpdate:selected': () => {} },
  })
  const header = w.get('[aria-label="Select all rows"]').element as HTMLInputElement
  expect(header.indeterminate).toBe(true)
  expect(w.findAll('.vk-table__body [role=row]')[1]!.attributes('aria-selected')).toBe('true')

  await w.get('[aria-label="Select row 1"]').trigger('change')
  expect(w.emitted('update:selected')?.[0]).toEqual([[1, 0]])
  await w.get('[aria-label="Select all rows"]').trigger('change')
  expect(w.emitted('update:selected')?.[1]).toEqual([[0, 1, 2]])
})

it('shows skeleton rows while loading', () => {
  const w = mount(VkDataTable<Row>, { props: { rows: [], columns, rowKey: 'id', caption: 'Users', loading: true, height: 120, rowHeight: 40 } })
  expect(w.get('[role=table]').attributes('aria-busy')).toBe('true')
  expect(w.findAll('.vk-table__loading .vk-table__row')).toHaveLength(3)
  expect(w.find('.vk-table__empty').exists()).toBe(false)
})

it('renders a footer slot with the sorted rows', () => {
  const w = mount(VkDataTable<Row>, {
    props: { rows: rows.slice(0, 4), columns, rowKey: 'id', caption: 'Users' },
    slots: { footer: '<template #footer="{ rows }">Итого: {{ rows.length }}</template>' },
  })
  expect(w.get('.vk-table__footer').text()).toBe('Итого: 4')
})
