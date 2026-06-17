import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkKbd from './VkKbd.vue'

it('splits a shortcut into keys', () => {
  const w = mount(VkKbd, { props: { keys: 'Shift + K' } })
  expect(w.findAll('kbd').map((k) => k.text())).toEqual(['Shift', 'K'])
})

it('maps mod to the platform modifier', () => {
  const key = mount(VkKbd, { props: { keys: 'mod+S' } }).findAll('kbd')[0]!.text()
  expect(['⌘', 'Ctrl']).toContain(key)
})
