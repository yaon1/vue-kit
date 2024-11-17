import { describe, expect, it } from 'vitest'
import { nextSort, sortRows } from './sort'

const get = (r: Record<string, unknown>, k: string) => r[k]

describe('sortRows', () => {
  it('sorts naturally and keeps nullish last in both directions', () => {
    const rows = [{ v: 'item10' }, { v: null }, { v: 'item2' }, { v: 'Item1' }]
    expect(sortRows(rows, { key: 'v', direction: 'asc' }, get).map((r) => r.v)).toEqual(['Item1', 'item2', 'item10', null])
    expect(sortRows(rows, { key: 'v', direction: 'desc' }, get).map((r) => r.v)).toEqual(['item10', 'item2', 'Item1', null])
  })

  it('is stable', () => {
    const rows = [{ g: 1, id: 'a' }, { g: 0, id: 'b' }, { g: 1, id: 'c' }]
    expect(sortRows(rows, { key: 'g', direction: 'asc' }, get).map((r) => r.id)).toEqual(['b', 'a', 'c'])
  })
})

it('nextSort cycles asc → desc → none', () => {
  const a = nextSort(null, 'x')
  const d = nextSort(a, 'x')
  expect([a?.direction, d?.direction, nextSort(d, 'x')]).toEqual(['asc', 'desc', null])
})
