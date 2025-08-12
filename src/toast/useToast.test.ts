import { afterEach, describe, expect, it, vi } from 'vitest'
import { useToast } from './useToast'

describe('useToast', () => {
  const t = useToast()
  afterEach(() => {
    t.clear()
    vi.useRealTimers()
  })

  it('auto-dismisses after duration', () => {
    vi.useFakeTimers()
    t.success('Saved', { duration: 1000 })
    expect(t.toasts).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(t.toasts).toHaveLength(0)
  })

  it('keeps errors until dismissed', () => {
    vi.useFakeTimers()
    const id = t.error('Boom')
    vi.advanceTimersByTime(60_000)
    expect(t.toasts[0]?.kind).toBe('error')
    t.dismiss(id)
    expect(t.toasts).toHaveLength(0)
  })

  it('keeps at most five toasts', () => {
    for (let i = 1; i <= 7; i++) t.show(`#${i}`, { duration: 0 })
    expect(t.toasts.map((x) => x.message)).toEqual(['#3', '#4', '#5', '#6', '#7'])
  })
})
