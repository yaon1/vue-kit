import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import VkTooltip from './VkTooltip.vue'

function setup() {
  return mount(VkTooltip, {
    props: { text: 'Копировать ссылку', delay: 300 },
    slots: { default: `<template #default="{ describedby }"><button :aria-describedby="describedby">⧉</button></template>` },
    attachTo: document.body,
  })
}

it('describes the trigger and shows on focus immediately', async () => {
  vi.useFakeTimers()
  const w = setup()
  const tip = w.get('[role=tooltip]')
  expect(w.get('button').attributes('aria-describedby')).toBe(tip.attributes('id'))
  expect(tip.isVisible()).toBe(false)

  await w.trigger('focusin')
  vi.runAllTimers()
  await w.vm.$nextTick()
  expect(tip.isVisible()).toBe(true)

  await w.trigger('keydown', { key: 'Escape' })
  expect(tip.isVisible()).toBe(false)
  vi.useRealTimers()
})

it('waits for the hover delay', async () => {
  vi.useFakeTimers()
  const w = setup()
  await w.trigger('mouseenter')
  vi.advanceTimersByTime(200)
  await w.vm.$nextTick()
  expect(w.get('[role=tooltip]').isVisible()).toBe(false)
  vi.advanceTimersByTime(100)
  await w.vm.$nextTick()
  expect(w.get('[role=tooltip]').isVisible()).toBe(true)
  vi.useRealTimers()
})
