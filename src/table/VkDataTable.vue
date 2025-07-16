<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onBeforeUnmount, onMounted, ref, toRef } from 'vue'
import { nextSort, sortRows, type SortState } from './sort'
import { useVirtualList } from './useVirtualList'

export interface Column<R> {
  key: string
  label: string
  width?: string
  align?: 'start' | 'end' | 'center'
  sortable?: boolean
  value?: (row: R) => unknown
  format?: (value: unknown, row: R) => string
}

const props = withDefaults(
  defineProps<{
    rows: readonly T[]
    columns: readonly Column<T>[]
    rowKey: keyof T & string
    caption: string
    height?: number
    rowHeight?: number
    /** Show a checkbox column bound to v-model:selected (row keys). */
    selectable?: boolean
  }>(),
  { height: 400, rowHeight: 40, selectable: false },
)

const sort = defineModel<SortState | null>('sort', { default: null })
const selected = defineModel<unknown[]>('selected', { default: () => [] })
const emit = defineEmits<{ rowClick: [row: T, event: MouseEvent] }>()
defineSlots<{ [K: `cell-${string}`]: (props: { row: T; value: unknown }) => unknown; empty(): unknown }>()

const viewport = ref<HTMLElement>()
const viewportHeight = ref(props.height)
const columnsByKey = computed(() => new Map(props.columns.map((c) => [c.key, c])))

function valueOf(row: T, key: string): unknown {
  const column = columnsByKey.value.get(key)
  return column?.value ? column.value(row) : row[key]
}

const sorted = computed(() => sortRows(props.rows, sort.value, valueOf))
const { scrollTop, range, totalHeight, offset } = useVirtualList(
  computed(() => sorted.value.length),
  props.rowHeight,
  viewportHeight,
)
const visible = computed(() =>
  sorted.value.slice(range.value.start, range.value.end).map((row, i) => ({ row, index: range.value.start + i })),
)
const template = computed(() => (props.selectable ? '44px ' : '') + props.columns.map((c) => c.width ?? 'minmax(0, 1fr)').join(' '))

const selectedSet = computed(() => new Set(selected.value))
const allSelected = computed(() => props.rows.length > 0 && props.rows.every((r) => selectedSet.value.has(r[props.rowKey])))
const someSelected = computed(() => !allSelected.value && props.rows.some((r) => selectedSet.value.has(r[props.rowKey])))

function toggleRow(row: T) {
  const key = row[props.rowKey]
  selected.value = selectedSet.value.has(key) ? selected.value.filter((k) => k !== key) : [...selected.value, key]
}

function toggleAll() {
  selected.value = allSelected.value ? [] : props.rows.map((r) => r[props.rowKey])
}

function ariaSort(key: string): 'ascending' | 'descending' | 'none' {
  if (sort.value?.key !== key) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

function display(column: Column<T>, row: T): string {
  const value = valueOf(row, column.key)
  if (column.format) return column.format(value, row)
  return value === null || value === undefined ? '—' : String(value)
}

let observer: ResizeObserver | undefined
onMounted(() => {
  if (typeof ResizeObserver === 'undefined' || !viewport.value) return
  observer = new ResizeObserver(([entry]) => entry && (viewportHeight.value = entry.contentRect.height))
  observer.observe(viewport.value)
})
onBeforeUnmount(() => observer?.disconnect())

defineExpose({ scrollToIndex: (i: number) => viewport.value?.scrollTo({ top: i * props.rowHeight }) })
</script>

<template>
  <div class="vk-table" role="table" :aria-label="caption" :aria-rowcount="sorted.length + 1">
    <div class="vk-table__head" role="rowgroup">
      <div class="vk-table__row" role="row" aria-rowindex="1" :style="{ gridTemplateColumns: template }">
        <div v-if="selectable" role="columnheader" class="vk-table__th vk-table__select">
          <input
            type="checkbox"
            aria-label="Select all rows"
            :checked="allSelected"
            :indeterminate="someSelected"
            @change="toggleAll"
          />
        </div>
        <div
          v-for="column in columns"
          :key="column.key"
          role="columnheader"
          class="vk-table__th"
          :class="`is-${column.align ?? 'start'}`"
          :aria-sort="column.sortable ? ariaSort(column.key) : undefined"
        >
          <button v-if="column.sortable" type="button" class="vk-table__sort" @click="sort = nextSort(sort, column.key)">
            {{ column.label }}
            <span aria-hidden="true" class="vk-table__arrow">{{
              ariaSort(column.key) === 'ascending' ? '▲' : ariaSort(column.key) === 'descending' ? '▼' : '↕'
            }}</span>
          </button>
          <template v-else>{{ column.label }}</template>
        </div>
      </div>
    </div>

    <div
      ref="viewport"
      class="vk-table__body"
      role="rowgroup"
      :style="{ height: `${height}px` }"
      @scroll.passive="scrollTop = ($event.target as HTMLElement).scrollTop"
    >
      <div v-if="sorted.length === 0" class="vk-table__empty"><slot name="empty">No data</slot></div>
      <div v-else :style="{ height: `${totalHeight}px`, position: 'relative' }">
        <div :style="{ transform: `translateY(${offset}px)` }">
          <div
            v-for="{ row, index } in visible"
            :key="String(row[rowKey])"
            class="vk-table__row"
            role="row"
            :aria-rowindex="index + 2"
            :style="{ gridTemplateColumns: template, height: `${rowHeight}px` }"
            :aria-selected="selectable ? selectedSet.has(row[rowKey]) : undefined"
            @click="emit('rowClick', row, $event)"
          >
            <div v-if="selectable" role="cell" class="vk-table__td vk-table__select" @click.stop>
              <input type="checkbox" :aria-label="`Select row ${index + 1}`" :checked="selectedSet.has(row[rowKey])" @change="toggleRow(row)" />
            </div>
            <div
              v-for="column in columns"
              :key="column.key"
              role="cell"
              class="vk-table__td"
              :class="`is-${column.align ?? 'start'}`"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="valueOf(row, column.key)">{{ display(column, row) }}</slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vk-table {
  font-family: var(--vk-font);
  color: var(--vk-text);
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  overflow: hidden;
  background: var(--vk-bg);
  font-variant-numeric: tabular-nums;
}
.vk-table__head { background: var(--vk-surface); border-bottom: 1px solid var(--vk-border); }
.vk-table__body { overflow-y: auto; overscroll-behavior: contain; }
.vk-table__row { display: grid; align-items: center; }
.vk-table__body .vk-table__row { border-bottom: 1px solid var(--vk-border); box-sizing: border-box; }
.vk-table__body .vk-table__row:hover { background: var(--vk-surface); }
.vk-table__th,
.vk-table__td { padding: 0 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vk-table__th { padding-block: 10px; font-size: 13px; font-weight: 600; color: var(--vk-muted); }
.is-end { text-align: end; }
.is-center { text-align: center; }
.vk-table__sort {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  border-radius: 4px;
}
.vk-table__sort:focus-visible { box-shadow: var(--vk-focus); }
.vk-table__arrow { font-size: 10px; opacity: 0.7; }
.vk-table__select { display: flex; align-items: center; justify-content: center; padding: 0; }
.vk-table__select input { accent-color: var(--vk-accent); }
.vk-table__row[aria-selected='true'] { background: color-mix(in srgb, var(--vk-accent) 8%, transparent); }
.vk-table__empty { padding: 32px; text-align: center; color: var(--vk-muted); }
</style>
