<script setup lang="ts">
import { ref } from 'vue'
import { VkCombobox, VkDataTable, VkToastHost, useToast, type Column, type SortState } from '../src'
import { VkButton } from '../src'
import { VkSpinner } from '../src'
// extra-imports

type Country = { code: string; name: string }
const countries: Country[] = ['DE Germany', 'FR France', 'GE Georgia', 'JP Japan', 'KZ Kazakhstan', 'TH Thailand', 'US United States']
  .map((s) => ({ code: s.slice(0, 2), name: s.slice(3) }))
const country = ref<Country | null>(null)

type Order = { id: number; customer: string; total: number; createdAt: Date }
const orders: Order[] = Array.from({ length: 50_000 }, (_, i) => ({
  id: i + 1,
  customer: `Customer ${(i * 7919) % 5000}`,
  total: Math.round(((i * 104729) % 100000) / 3) / 10,
  createdAt: new Date(Date.UTC(2026, 0, 1) + i * 600_000),
}))
const money = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' })
const columns: Column<Order>[] = [
  { key: 'id', label: '#', width: '80px', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'total', label: 'Total', align: 'end', sortable: true, format: (v) => money.format(v as number) },
  { key: 'createdAt', label: 'Created', sortable: true, format: (v) => (v as Date).toLocaleString() },
]
const sort = ref<SortState | null>(null)

const toast = useToast()
</script>

<template>
  <main>
    <h1>vue-kit</h1>

    <section>
      <h2>Combobox</h2>
      <VkCombobox v-model="country" :options="countries" :get-label="(c) => c.name" label="Country" placeholder="Start typing…">
        <template #option="{ option }"><b>{{ option.code }}</b> {{ option.name }}</template>
      </VkCombobox>
      <p>Selected: {{ country?.name ?? 'none' }}</p>
    </section>

    <section>
      <h2>DataTable — {{ orders.length.toLocaleString() }} rows</h2>
      <VkDataTable v-model:sort="sort" :rows="orders" :columns="columns" row-key="id" caption="Orders" :height="360">
        <template #cell-customer="{ row }"><a href="#" @click.prevent="toast.show(`Open ${row.customer}`)">{{ row.customer }}</a></template>
      </VkDataTable>
    </section>

    <section>
      <h2>Toast</h2>
      <button @click="toast.success('Saved')">Success</button>
      <button @click="toast.error('Upload failed', { action: { label: 'Retry', onClick: () => toast.show('Retrying…') } })">Error</button>
    </section>

    <section>
      <h2>Button</h2>
      <VkButton variant="primary" @click="toast.success('Primary')">Primary</VkButton>
      <VkButton>Secondary</VkButton>
      <VkButton variant="ghost">Ghost</VkButton>
      <VkButton variant="danger">Удалить</VkButton>
      <VkButton loading>Загрузка</VkButton>
      <VkSpinner :size="20" />
    </section>

    <VkToastHost />
  </main>
</template>

<style>
body { margin: 0; background: var(--vk-bg); color: var(--vk-text); font-family: var(--vk-font); }
main { max-width: 880px; margin: 0 auto; padding: 24px 16px; }
section { margin-block: 32px; }
button { margin-right: 8px; }
</style>
