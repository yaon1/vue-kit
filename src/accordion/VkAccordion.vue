<script setup lang="ts">
import { useId } from 'vue'

export interface AccordionItem {
  key: string
  title: string
}

const props = withDefaults(defineProps<{ items: readonly AccordionItem[]; multiple?: boolean }>(), { multiple: false })
const open = defineModel<string[]>({ default: () => [] })
defineSlots<Record<string, (props: { item: AccordionItem }) => unknown>>()
const id = useId()

function toggle(key: string) {
  const isOpen = open.value.includes(key)
  if (isOpen) open.value = open.value.filter((k) => k !== key)
  else open.value = props.multiple ? [...open.value, key] : [key]
}
</script>

<template>
  <div class="vk-accordion">
    <div v-for="item in items" :key="item.key" class="vk-accordion__item">
      <h3 class="vk-accordion__heading">
        <button
          :id="`${id}-h-${item.key}`"
          type="button"
          class="vk-accordion__trigger"
          :aria-expanded="open.includes(item.key)"
          :aria-controls="`${id}-p-${item.key}`"
          @click="toggle(item.key)"
        >
          {{ item.title }}
          <span class="vk-accordion__icon" aria-hidden="true">▾</span>
        </button>
      </h3>
      <div
        v-show="open.includes(item.key)"
        :id="`${id}-p-${item.key}`"
        role="region"
        class="vk-accordion__panel"
        :aria-labelledby="`${id}-h-${item.key}`"
      >
        <slot :name="item.key" :item="item" />
      </div>
    </div>
  </div>
</template>

<style>
.vk-accordion { border: 1px solid var(--vk-border); border-radius: var(--vk-radius); font-family: var(--vk-font); color: var(--vk-text); }
.vk-accordion__item + .vk-accordion__item { border-top: 1px solid var(--vk-border); }
.vk-accordion__heading { margin: 0; font-size: inherit; }
.vk-accordion__trigger { display: flex; width: 100%; justify-content: space-between; padding: 12px 14px; border: 0; background: none; color: inherit; font: inherit; font-weight: 600; text-align: left; cursor: pointer; }
.vk-accordion__trigger:focus-visible { outline: none; box-shadow: inset var(--vk-focus); }
.vk-accordion__icon { transition: transform 0.15s; }
.vk-accordion__trigger[aria-expanded='true'] .vk-accordion__icon { transform: rotate(180deg); }
.vk-accordion__panel { padding: 0 14px 14px; color: var(--vk-muted); }
</style>
