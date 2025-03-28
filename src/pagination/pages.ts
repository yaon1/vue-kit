export type PageItem = number | 'gap'

/**
 * Page numbers to render: always first and last, `siblings` around the current page,
 * and 'gap' markers where pages are skipped. A gap never hides a single page.
 */
export function pageItems(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 0) return []
  // Short ranges fit without gaps; showing every page beats a lone "…".
  if (total <= siblings * 2 + 5) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.max(2, current - siblings)
  const end = Math.min(total - 1, current + siblings)
  const items: PageItem[] = [1]

  if (start === 3) items.push(2)
  else if (start > 3) items.push('gap')
  for (let p = start; p <= end; p++) items.push(p)
  if (end === total - 2) items.push(total - 1)
  else if (end < total - 2) items.push('gap')
  if (total > 1) items.push(total)

  return items
}
