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
