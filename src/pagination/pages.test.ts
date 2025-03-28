import { describe, expect, it } from 'vitest'
import { pageItems } from './pages'

describe('pageItems', () => {
  it.each([
    [1, 1, [1]],
    [1, 5, [1, 2, 3, 4, 5]],
    [1, 10, [1, 2, 'gap', 10]],
    [5, 10, [1, 'gap', 4, 5, 6, 'gap', 10]],
    [3, 10, [1, 2, 3, 4, 'gap', 10]],
    [10, 10, [1, 'gap', 9, 10]],
  ])('page %i of %i', (current, total, expected) => {
    expect(pageItems(current, total)).toEqual(expected)
  })

  it('handles empty results', () => expect(pageItems(1, 0)).toEqual([]))
})
