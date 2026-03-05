<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import { useClickOutside } from '../composables/useClickOutside'

export interface MenuItem {
  key: string
  label: string
  disabled?: boolean
  danger?: boolean
}

defineProps<{ items: readonly MenuItem[]; label: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const id = useId()
const open = ref(false)
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const list = ref<HTMLElement>()
useClickOutside([root], () => (open.value = false))

function enabledItems(): HTMLElement[] {
  return Array.from(list.value?.querySelectorAll<HTMLElement>('[role=menuitem]:not([aria-disabled=true])') ?? [])
}

async function show(focus: 'first' | 'last' = 'first') {
  open.value = true
  await nextTick()
  const items = enabledItems()
  ;(focus === 'first' ? items[0] : items[items.length - 1])?.focus()
}

function close(returnFocus = true) {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

function choose(item: MenuItem) {
  if (item.disabled) return
  emit('select', item.key)
  close()
}

function onMenuKeydown(event: KeyboardEvent) {
  const items = enabledItems()
  const index = items.indexOf(document.activeElement as HTMLElement)
  const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }[event.key]
  if (event.key === 'Escape' || event.key === 'Tab') {
    close(event.key === 'Escape')
    return
  }
  if (next === undefined) return
  event.preventDefault()
  items[(next + items.length) % items.length]?.focus()
}

defineExpose({ show, close })
</script>

<template>
  <div ref="root" class="vk-menu">
    <button
      ref="trigger"
      type="button"
      class="vk-menu__trigger"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="`${id}-menu`"
      @click="open ? close() : show()"
      @keydown.down.prevent="show('first')"
      @keydown.up.prevent="show('last')"
    >
      <slot name="trigger">{{ label }}</slot>
    </button>
    <ul v-show="open" :id="`${id}-menu`" ref="list" class="vk-menu__list" role="menu" :aria-label="label" @keydown="onMenuKeydown">
      <li
        v-for="item in items"
        :key="item.key"
        role="menuitem"
        tabindex="-1"
        class="vk-menu__item"
        :class="{ 'is-danger': item.danger }"
        :aria-disabled="item.disabled || undefined"
        @click="choose(item)"
        @keydown.enter.prevent="choose(item)"
        @keydown.space.prevent="choose(item)"
      >
        <slot name="item" :item="item">{{ item.label }}</slot>
      </li>
    </ul>
  </div>
</template>

<style>
.vk-menu { position: relative; display: inline-block; font-family: var(--vk-font); }
.vk-menu__trigger { padding: 6px 10px; border: 1px solid var(--vk-border); border-radius: var(--vk-radius); background: var(--vk-bg); color: var(--vk-text); font: inherit; cursor: pointer; }
.vk-menu__trigger:focus-visible { outline: none; box-shadow: var(--vk-focus); }
.vk-menu__list { position: absolute; z-index: 30; right: 0; min-width: 180px; margin: 4px 0 0; padding: 4px; list-style: none; border: 1px solid var(--vk-border); border-radius: var(--vk-radius); background: var(--vk-bg); box-shadow: var(--vk-shadow); }
.vk-menu__item { padding: 7px 10px; border-radius: 4px; color: var(--vk-text); cursor: pointer; }
.vk-menu__item:focus, .vk-menu__item:hover { outline: none; background: var(--vk-surface); }
.vk-menu__item.is-danger { color: var(--vk-danger); }
.vk-menu__item[aria-disabled='true'] { opacity: 0.5; cursor: not-allowed; }
</style>
