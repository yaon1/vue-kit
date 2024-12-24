# vue-kit

Small, accessible Vue 3 components that do the hard parts right. **12 kB JS + 4 kB CSS gzipped ≈ 5.5 kB**, zero dependencies.

| Component | Highlights |
|---|---|
| `VkCombobox` | WAI-ARIA 1.2 combobox, generic `T`, custom filter, option slot, keyboard (↑ ↓ Home End Enter Esc) |
| `VkDataTable` | Virtualized (100k+ rows), stable natural sort, `aria-sort` / `aria-rowcount`, cell slots, `v-model:sort` |
| `VkToastHost` + `useToast()` | `role=status` / `alert`, actions, auto-dismiss, respects `prefers-reduced-motion` |

Light and dark themes via CSS custom properties.

## Install

```bash
npm i @yaon1/vue-kit
```

```ts
import '@yaon1/vue-kit/style.css'
import { VkCombobox, VkDataTable, VkToastHost, useToast } from '@yaon1/vue-kit'
```

## Combobox

```vue
<VkCombobox v-model="country" :options="countries" :get-label="(c) => c.name" label="Country">
  <template #option="{ option }">{{ option.flag }} {{ option.name }}</template>
</VkCombobox>
```

## DataTable

```vue
<script setup lang="ts">
const columns: Column<Order>[] = [
  { key: 'id', label: '#', width: '80px', sortable: true },
  { key: 'total', label: 'Total', align: 'end', sortable: true, format: (v) => money.format(v as number) },
  { key: 'customer', label: 'Customer', value: (o) => o.customer.name, sortable: true },
]
</script>

<VkDataTable v-model:sort="sort" :rows="orders" :columns="columns" row-key="id" caption="Orders" :height="480">
  <template #cell-customer="{ row }"><a :href="`/c/${row.customer.id}`">{{ row.customer.name }}</a></template>
</VkDataTable>
```

## Toast

```ts
const toast = useToast()
toast.success('Saved')
toast.error('Upload failed', { action: { label: 'Retry', onClick: retry } }) // errors stay until dismissed
```

Mount `<VkToastHost position="bottom-right" />` once near the app root.

## Theming

Override any token:

```css
:root {
  --vk-accent: #0ca678;
  --vk-radius: 4px;
}
```

Force a theme with `<html data-theme="dark">` (or `light`); otherwise it follows `prefers-color-scheme`.

## Development

```bash
npm i
npm run dev        # playground at http://localhost:5173
npm test
npm run typecheck
npm run build
```

## License

MIT
