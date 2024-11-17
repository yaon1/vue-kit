export type SortDirection = 'asc' | 'desc'
export interface SortState<K extends string = string> {
  key: K
  direction: SortDirection
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  return collator.compare(String(a), String(b))
}

/** Stable sort; nullish values always go last regardless of direction. */
export function sortRows<T>(rows: readonly T[], sort: SortState | null, get: (row: T, key: string) => unknown): T[] {
  if (sort === null) return [...rows]
  const sign = sort.direction === 'asc' ? 1 : -1
  return rows
    .map((row, index) => ({ row, index }))
    .sort((x, y) => {
      const a = get(x.row, sort.key)
      const b = get(y.row, sort.key)
      const nullish = (a ?? null) === null || (b ?? null) === null
      return (nullish ? compareValues(a, b) : sign * compareValues(a, b)) || x.index - y.index
    })
    .map((e) => e.row)
}

export function nextSort(current: SortState | null, key: string): SortState | null {
  if (current?.key !== key) return { key, direction: 'asc' }
  return current.direction === 'asc' ? { key, direction: 'desc' } : null
}
