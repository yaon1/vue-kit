import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { nextTick } from 'vue'
import VkDialog from './VkDialog.vue'

function setup(dismissible = true) {
  return mount(VkDialog, {
    props: { title: 'Удалить проект?', open: false, dismissible, 'onUpdate:open': () => {} },
    slots: { default: '<p>Это действие нельзя отменить.</p>', footer: '<button id="ok">OK</button>' },
    attachTo: document.body,
  })
}

it('labels the dialog by its title and opens on v-model', async () => {
  const w = setup()
  const dialog = w.get('dialog')
  expect(document.getElementById(dialog.attributes('aria-labelledby')!)?.textContent).toBe('Удалить проект?')

  await w.setProps({ open: true })
  await nextTick()
  expect((dialog.element as HTMLDialogElement).hasAttribute('open')).toBe(true)
  w.unmount()
})

it('closes from the close button and the backdrop only when dismissible', async () => {
  const w = setup()
  await w.setProps({ open: true })
  await w.get('.vk-dialog__close').trigger('click')
  expect(w.emitted('update:open')?.at(-1)).toEqual([false])

  const strict = setup(false)
  await strict.setProps({ open: true })
  await strict.get('dialog').trigger('click')
  expect(strict.emitted('update:open')).toBeUndefined()
  w.unmount()
  strict.unmount()
})

it('renders as a side drawer', () => {
  const w = mount(VkDialog, { props: { title: 'Фильтры', placement: 'right' } })
  expect(w.get('dialog').classes()).toContain('vk-dialog--right')
})
