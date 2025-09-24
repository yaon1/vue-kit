import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkTextarea from './VkTextarea.vue'

it('binds v-model and sets a height when autosizing', async () => {
  const w = mount(VkTextarea, { props: { label: 'Комментарий' }, attachTo: document.body })
  await w.get('textarea').setValue('строка\nещё строка')
  await w.vm.$nextTick()
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['строка\nещё строка'])
  expect((w.get('textarea').element as HTMLTextAreaElement).style.height).toMatch(/px$/)
  w.unmount()
})
