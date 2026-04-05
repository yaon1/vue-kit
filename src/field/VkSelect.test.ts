import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import VkSelect from './VkSelect.vue'

it('renders options and emits the typed value', async () => {
  const w = mount(VkSelect<number>, {
    props: {
      label: 'Срок',
      placeholder: 'Выберите',
      options: [
        { value: 7, label: 'Неделя' },
        { value: 30, label: 'Месяц' },
      ],
      'onUpdate:modelValue': () => {},
    },
  })
  expect(w.findAll('option').map((o) => o.text())).toEqual(['Выберите', 'Неделя', 'Месяц'])
  await w.get('select').setValue(30)
  expect(w.emitted('update:modelValue')).toEqual([[30]])
})
