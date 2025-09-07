import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkInput from './VkInput.vue'

it('links label, hint and error to the input', async () => {
  const w = mount(VkInput, { props: { label: 'Email', hint: 'Мы не рассылаем спам', type: 'email', required: true }, attrs: { autocomplete: 'email' } })
  const input = w.get('input')
  expect(w.get('label').attributes('for')).toBe(input.attributes('id'))
  expect(w.get(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe('Мы не рассылаем спам')
  expect(input.attributes('autocomplete')).toBe('email')

  await w.setProps({ error: 'Некорректный адрес' })
  expect(input.attributes('aria-invalid')).toBe('true')
  expect(w.get(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe('Некорректный адрес')
})

it('binds v-model', async () => {
  const w = mount(VkInput, { props: { label: 'Имя', modelValue: '', 'onUpdate:modelValue': () => {} } })
  await w.get('input').setValue('Ада')
  expect(w.emitted('update:modelValue')).toEqual([['Ада']])
})
