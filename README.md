# vue-kit

**Небольшие доступные компоненты для Vue 3, в которых сложные части уже сделаны правильно.** Combobox с полной клавиатурной навигацией по WAI-ARIA, таблица на 100 000+ строк без тормозов благодаря виртуализации, тосты, которые озвучивают скринридеры. **≈ 5,5 кБ gzip**, без зависимостей.

| Компонент | Что умеет |
|---|---|
| `VkCombobox` | WAI-ARIA 1.2, generic `T`, свой фильтр, слот для опции, клавиатура (↑ ↓ Home End Enter Esc) |
| `VkDataTable` | Виртуализация, стабильная «натуральная» сортировка, `aria-sort`/`aria-rowcount`, слоты ячеек, `v-model:sort` |
| `VkToastHost` + `useToast()` | `role=status`/`alert`, кнопки действий, автоскрытие, учитывает `prefers-reduced-motion` |

Светлая и тёмная темы на CSS-переменных.

## Пример использования

```vue
<script setup lang="ts">
import '@yaon1/vue-kit/style.css'
import { VkCombobox, VkDataTable, VkToastHost, useToast, type Column } from '@yaon1/vue-kit'

const columns: Column<Order>[] = [
  { key: 'id', label: '#', width: '80px', sortable: true },
  { key: 'total', label: 'Сумма', align: 'end', sortable: true, format: (v) => money.format(v as number) },
  { key: 'customer', label: 'Клиент', value: (o) => o.customer.name, sortable: true },
]
const toast = useToast()
</script>

<template>
  <VkCombobox v-model="country" :options="countries" :get-label="(c) => c.name" label="Страна" />

  <VkDataTable v-model:sort="sort" :rows="orders" :columns="columns" row-key="id" caption="Заказы" :height="480">
    <template #cell-customer="{ row }"><a :href="`/c/${row.customer.id}`">{{ row.customer.name }}</a></template>
  </VkDataTable>

  <button @click="toast.error('Не удалось загрузить', { action: { label: 'Повторить', onClick: retry } })">…</button>
  <VkToastHost position="bottom-right" />
</template>
```

Ошибки в тостах не скрываются сами, пока пользователь их не закроет.

## Установка

```bash
npm i @yaon1/vue-kit
```

## Темы

```css
:root {
  --vk-accent: #0ca678;
  --vk-radius: 4px;
}
```

Тему можно задать явно через `<html data-theme="dark">` или `light`. Без атрибута она следует `prefers-color-scheme`.

## Разработка

```bash
npm i
npm run dev        # playground: http://localhost:5173
npm test
npm run typecheck
npm run build
```

## Лицензия

MIT
