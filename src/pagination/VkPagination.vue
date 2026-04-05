<script setup lang="ts">
import { computed } from 'vue'
import { pageItems } from './pages'

const props = withDefaults(defineProps<{ total: number; siblings?: number; label?: string }>(), {
  siblings: 1,
  label: 'Pagination',
})
const page = defineModel<number>({ required: true })
const items = computed(() => pageItems(page.value, props.total, props.siblings))

function go(p: number) {
  page.value = Math.min(Math.max(1, p), props.total)
}
</script>

<template>
  <nav v-if="total > 1" class="vk-pagination" :aria-label="label">
    <button type="button" class="vk-pagination__btn" :disabled="page <= 1" aria-label="Previous page" @click="go(page - 1)">‹</button>
    <template v-for="(item, i) in items" :key="i">
      <span v-if="item === 'gap'" class="vk-pagination__gap" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        class="vk-pagination__btn"
        :class="{ 'is-current': item === page }"
        :aria-current="item === page ? 'page' : undefined"
        :aria-label="`Page ${item}`"
        @click="go(item)"
      >
        {{ item }}
      </button>
    </template>
    <button type="button" class="vk-pagination__btn" :disabled="page >= total" aria-label="Next page" @click="go(page + 1)">›</button>
  </nav>
</template>

<style>
.vk-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-family: var(--vk-font);
}
.vk-pagination__btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  background: var(--vk-bg);
  color: var(--vk-text);
  font: inherit;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.vk-pagination__btn.is-current {
  background: var(--vk-accent);
  border-color: var(--vk-accent);
  color: var(--vk-accent-text);
}
.vk-pagination__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.vk-pagination__btn:focus-visible {
  outline: none;
  box-shadow: var(--vk-focus);
}
.vk-pagination__gap {
  padding: 0 4px;
  color: var(--vk-muted);
}
</style>
