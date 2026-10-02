<script setup lang="ts">
import { ref } from 'vue'
import { VkCombobox, VkDataTable, VkToastHost, useToast, type Column, type SortState } from '../src'
import { VkButton } from '../src'
import { VkSpinner } from '../src'
import { VkDialog } from '../src'
import { VkTabs } from '../src'
import { VkTooltip } from '../src'
import { VkPagination } from '../src'
import { VkSwitch } from '../src'
import { VkCheckbox } from '../src'
import { VkBadge } from '../src'
import { VkAlert } from '../src'
import { VkSkeleton } from '../src'
import { VkProgress } from '../src'
import { VkAccordion } from '../src'
import { VkMenu } from '../src'
import { VkSelect } from '../src'
import { useTheme } from '../src'
import { VkInput } from '../src'
import { VkTextarea } from '../src'
import { useDebounced } from '../src'
import { VkAvatar } from '../src'
import { VkBreadcrumbs } from '../src'
import { VkCard } from '../src'
import { VkEmptyState } from '../src'
import { VkKbd } from '../src'
import { VkCopyButton } from '../src'
// extra-imports

type Country = { code: string; name: string }
const countries: Country[] = ['DE Germany', 'FR France', 'GE Georgia', 'JP Japan', 'KZ Kazakhstan', 'TH Thailand', 'US United States'].map(
  (s) => ({ code: s.slice(0, 2), name: s.slice(3) }),
)
const country = ref<Country | null>(null)

// Simulated server search with latency.
const allCities = ['Москва', 'Санкт-Петербург', 'Казань', 'Бангкок', 'Пхукет', 'Алматы', 'Тбилиси']
const city = ref<string | null>(null)
const cities = ref<string[]>([])
const citiesLoading = ref(false)
const fetchCities = useDebounced((q: string) => {
  cities.value = allCities.filter((c) => c.toLowerCase().includes(q.toLowerCase()))
  citiesLoading.value = false
}, 400)
function searchCities(q: string) {
  citiesLoading.value = true
  fetchCities(q)
}

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
const selected = ref<unknown[]>([])
const tableLoading = ref(false)

const dialogOpen = ref(false)
function confirmDelete(close: () => void) {
  close()
  toast.error('Удалено')
}
const tab = ref('general')
const page = ref(1)
const notify = ref(true)
const agree = ref(false)
const showAlert = ref(true)
const theme = useTheme()
const email = ref('')
const comment = ref('')
const toast = useToast()
</script>

<template>
  <main>
    <header class="pg-header">
      <h1>vue-kit</h1>
      <VkSelect
        v-model="theme.preference.value"
        label="Тема"
        :options="[
          { value: 'system', label: 'Системная' },
          { value: 'light', label: 'Светлая' },
          { value: 'dark', label: 'Тёмная' },
        ]"
      />
    </header>

    <section>
      <h2>Combobox</h2>
      <VkCombobox v-model="country" :options="countries" :get-label="(c) => c.name" label="Country" placeholder="Start typing…">
        <template #option="{ option }"
          ><b>{{ option.code }}</b> {{ option.name }}</template
        >
      </VkCombobox>
      <p>Selected: {{ country?.name ?? 'none' }}</p>
      <VkCombobox
        v-model="city"
        :options="cities"
        :loading="citiesLoading"
        remote
        clearable
        label="Город (поиск на сервере)"
        @search="searchCities"
      />
    </section>

    <section>
      <h2>DataTable — {{ orders.length.toLocaleString() }} rows</h2>
      <p>
        <VkSwitch v-model="tableLoading" label="Загрузка" />
        Выбрано: {{ selected.length }}
      </p>
      <VkDataTable
        v-model:sort="sort"
        v-model:selected="selected"
        selectable
        :loading="tableLoading"
        :rows="orders"
        :columns="columns"
        row-key="id"
        caption="Orders"
        :height="360"
      >
        <template #footer="{ rows }">Всего строк: {{ rows.length.toLocaleString() }}</template>
        <template #cell-customer="{ row }"
          ><a href="#" @click.prevent="toast.show(`Open ${row.customer}`)">{{ row.customer }}</a></template
        >
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

    <section>
      <h2>Dialog</h2>
      <VkButton @click="dialogOpen = true">Открыть диалог</VkButton>
      <VkDialog v-model:open="dialogOpen" title="Удалить проект?">
        <p>Проект и все его данные будут удалены без возможности восстановления.</p>
        <template #footer="{ close }">
          <VkButton @click="close">Отмена</VkButton>
          <VkButton variant="danger" @click="confirmDelete(close)">Удалить</VkButton>
        </template>
      </VkDialog>
    </section>

    <section>
      <h2>Tabs</h2>
      <VkTabs
        v-model="tab"
        label="Настройки"
        :tabs="[
          { key: 'general', label: 'Общие' },
          { key: 'billing', label: 'Оплата', disabled: true },
          { key: 'security', label: 'Безопасность' },
        ]"
      >
        <template #general>Имя, язык, часовой пояс.</template>
        <template #security>Пароль и двухфакторная аутентификация.</template>
      </VkTabs>
    </section>

    <section>
      <h2>Tooltip</h2>
      <VkTooltip text="Скопировать ссылку">
        <template #default="{ describedby }"><VkButton :aria-describedby="describedby" aria-label="Копировать">⧉</VkButton></template>
      </VkTooltip>
    </section>

    <section>
      <h2>Pagination</h2>
      <VkPagination v-model="page" :total="20" />
      <p>Страница {{ page }}</p>
    </section>

    <section>
      <h2>Switch &amp; Checkbox</h2>
      <VkSwitch v-model="notify" label="Уведомления" description="Письмо при новом заказе" />
      <p><VkCheckbox v-model="agree" label="Согласен с условиями" /></p>
      <p><VkCheckbox label="Выбрать все" indeterminate /></p>
    </section>

    <section>
      <h2>Badge &amp; Alert</h2>
      <p><VkBadge>Черновик</VkBadge> <VkBadge tone="success" dot>Активен</VkBadge> <VkBadge tone="danger">Просрочен</VkBadge></p>
      <VkAlert v-if="showAlert" tone="warning" title="Подписка заканчивается" dismissible @dismiss="showAlert = false"
        >Продлите до 1 ноября, чтобы не потерять данные.</VkAlert
      >
    </section>

    <section>
      <h2>Skeleton &amp; Progress</h2>
      <VkSkeleton :lines="3" />
      <VkProgress label="Загрузка файла" :value="64" show-value />
      <VkProgress label="Обработка" />
    </section>

    <section>
      <h2>Accordion &amp; Menu</h2>
      <VkAccordion
        :items="[
          { key: 'pay', title: 'Как оплатить?' },
          { key: 'refund', title: 'Как вернуть деньги?' },
        ]"
      >
        <template #pay>Картой или по счёту для юрлиц.</template>
        <template #refund>В течение 14 дней через поддержку.</template>
      </VkAccordion>
      <p>
        <VkMenu
          label="Действия"
          :items="[
            { key: 'edit', label: 'Редактировать' },
            { key: 'archive', label: 'Архивировать', disabled: true },
            { key: 'delete', label: 'Удалить', danger: true },
          ]"
          @select="(k) => toast.show(k)"
        />
      </p>
    </section>

    <section>
      <h2>Form fields</h2>
      <form class="pg-form" @submit.prevent="toast.success('Отправлено')">
        <VkInput
          v-model="email"
          label="Email"
          type="email"
          required
          hint="Пришлём ссылку для входа"
          :error="email && !email.includes('@') ? 'Нужен адрес с @' : undefined"
        />
        <VkTextarea v-model="comment" label="Комментарий" />
        <VkButton type="submit" variant="primary">Отправить</VkButton>
      </form>
    </section>

    <section>
      <h2>Мелочи</h2>
      <VkBreadcrumbs :items="[{ label: 'Главная', href: '#' }, { label: 'Заказы', href: '#' }, { label: '№ 42' }]" />
      <p>
        <VkAvatar name="Ада Лавлейс" /> <VkAvatar name="Алан Тьюринг" :size="44" /> <VkKbd keys="mod+K" />
        <VkCopyButton text="npm i @yaon1/vue-kit" label="Копировать" copied-label="Скопировано" />
      </p>
      <VkCard>
        <template #header>Заказы</template>
        <VkEmptyState icon="📦" title="Пока нет заказов" description="Они появятся здесь после первой покупки.">
          <VkButton variant="primary">Создать заказ</VkButton>
        </VkEmptyState>
      </VkCard>
    </section>

    <VkToastHost />
  </main>
</template>

<style>
body {
  margin: 0;
  background: var(--vk-bg);
  color: var(--vk-text);
  font-family: var(--vk-font);
}
main {
  max-width: 880px;
  margin: 0 auto;
  padding: 24px 16px;
}
section {
  margin-block: 32px;
}
.pg-form {
  display: grid;
  gap: 12px;
  max-width: 420px;
}
.pg-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
}
button {
  margin-right: 8px;
}
</style>
