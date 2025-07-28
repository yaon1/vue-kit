<script setup lang="ts" generic="T">
import { computed, ref, useId, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    options: readonly T[]
    label: string
    getLabel?: (option: T) => string
    filter?: (option: T, query: string) => boolean
    placeholder?: string
    emptyText?: string
    clearable?: boolean
    /** Show a loading row, e.g. while `search` results are being fetched. */
    loading?: boolean
    /** Skip client-side filtering; filter on the server in a `search` handler instead. */
    remote?: boolean
  }>(),
  {
    getLabel: (option: T) => String(option),
    filter: undefined,
    placeholder: '',
    emptyText: 'No results',
    clearable: false,
    loading: false,
    remote: false,
  },
)

const model = defineModel<T | null>({ default: null })
const emit = defineEmits<{ search: [query: string] }>()

const id = useId()
const listboxId = `${id}-listbox`
const query = ref(model.value === null ? '' : props.getLabel(model.value))
const open = ref(false)
const active = ref(-1)

const filtered = computed(() => {
  if (props.remote) return props.options
  const q = query.value.trim().toLowerCase()
  if (q === '' || (model.value !== null && props.getLabel(model.value) === query.value)) return props.options
  const match = props.filter ?? ((o: T, s: string) => props.getLabel(o).toLowerCase().includes(s))
  return props.options.filter((o) => match(o, q))
})

watch(filtered, () => (active.value = filtered.value.length > 0 ? 0 : -1))
watch(model, (value) => (query.value = value === null ? '' : props.getLabel(value)))

function optionId(index: number): string {
  return `${id}-option-${index}`
}

function select(index: number): void {
  const option = filtered.value[index]
  if (option === undefined) return
  model.value = option
  query.value = props.getLabel(option)
  open.value = false
}

function move(delta: number): void {
  if (!open.value) {
    open.value = true
    return
  }
  const count = filtered.value.length
  if (count === 0) return
  active.value = (active.value + delta + count) % count
  document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: 'nearest' })
}

function onKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
      move(1)
      break
    case 'ArrowUp':
      move(-1)
      break
    case 'Home':
      active.value = 0
      break
    case 'End':
      active.value = filtered.value.length - 1
      break
    case 'Enter':
      if (!open.value) return
      select(active.value)
      break
    case 'Escape':
      if (open.value) open.value = false
      else query.value = ''
      break
    default:
      return
  }
  event.preventDefault()
}

function onInput(): void {
  emit('search', query.value)
  open.value = true
  if (query.value === '') model.value = null
}

function clear(): void {
  model.value = null
  query.value = ''
}

function onBlur(): void {
  open.value = false
  // Revert free text that doesn't match a selection.
  query.value = model.value === null ? '' : props.getLabel(model.value)
}
</script>

<template>
  <div class="vk-combobox">
    <label :for="id" class="vk-combobox__label">{{ label }}</label>
    <input
      :id="id"
      v-model="query"
      class="vk-combobox__input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-activedescendant="open && active >= 0 ? optionId(active) : undefined"
      :placeholder="placeholder"
      @input="onInput"
      @keydown="onKeydown"
      @focus="open = true"
      @blur="onBlur"
    />
    <button
      v-if="clearable && model !== null"
      type="button"
      class="vk-combobox__clear"
      aria-label="Clear selection"
      @mousedown.prevent
      @click="clear"
    >
      ×
    </button>
    <ul v-show="open" :id="listboxId" class="vk-combobox__listbox" role="listbox" :aria-label="label">
      <li
        v-for="(option, index) in filtered"
        :id="optionId(index)"
        :key="index"
        role="option"
        class="vk-combobox__option"
        :class="{ 'is-active': index === active }"
        :aria-selected="option === model"
        @mousedown.prevent="select(index)"
        @mousemove="active = index"
      >
        <slot name="option" :option="option" :active="index === active">{{ getLabel(option) }}</slot>
      </li>
      <li v-if="loading" class="vk-combobox__empty" role="presentation" aria-live="polite">Loading…</li>
      <li v-else-if="filtered.length === 0" class="vk-combobox__empty" role="presentation">{{ emptyText }}</li>
    </ul>
  </div>
</template>

<style>
.vk-combobox { position: relative; font-family: var(--vk-font); color: var(--vk-text); }
.vk-combobox__label { display: block; margin-bottom: 4px; font-size: 14px; color: var(--vk-muted); }
.vk-combobox__input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  background: var(--vk-bg);
  color: inherit;
  font: inherit;
}
.vk-combobox__input:focus { outline: none; border-color: var(--vk-accent); box-shadow: var(--vk-focus); }
.vk-combobox__clear {
  position: absolute;
  right: 6px;
  bottom: 6px;
  border: 0;
  background: none;
  color: var(--vk-muted);
  font-size: 18px;
  cursor: pointer;
}
.vk-combobox__listbox {
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  max-height: 260px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding: 4px;
  list-style: none;
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  background: var(--vk-bg);
  box-shadow: var(--vk-shadow);
}
.vk-combobox__option { padding: 6px 8px; border-radius: 4px; cursor: pointer; }
.vk-combobox__option.is-active { background: var(--vk-surface); }
.vk-combobox__option[aria-selected='true'] { font-weight: 600; color: var(--vk-accent); }
.vk-combobox__empty { padding: 6px 8px; color: var(--vk-muted); }
</style>
