import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import VkCopyButton from './VkCopyButton.vue'

it('writes to the clipboard and confirms', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  const w = mount(VkCopyButton, { props: { text: 'npm i @yaon1/vue-kit', copiedLabel: 'Скопировано' } })

  await w.trigger('click')
  await Promise.resolve()
  expect(writeText).toHaveBeenCalledWith('npm i @yaon1/vue-kit')
  expect(w.emitted('copied')).toHaveLength(1)
  expect(w.text()).toContain('Скопировано')
  vi.unstubAllGlobals()
})

it('emits error when the clipboard is unavailable', async () => {
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
  const w = mount(VkCopyButton, { props: { text: 'x' } })
  await w.trigger('click')
  await new Promise((r) => setTimeout(r))
  expect(w.emitted('error')).toHaveLength(1)
  vi.unstubAllGlobals()
})
