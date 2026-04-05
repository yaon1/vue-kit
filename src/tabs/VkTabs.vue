<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'

export interface Tab {
  key: string
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{ tabs: readonly Tab[]; label: string; orientation?: 'horizontal' | 'vertical' }>(), {
  orientation: 'horizontal',
})
const active = defineModel<string>({ required: true })
defineSlots<Record<string, (props: { tab: Tab }) => unknown>>()

const id = useId()
const list = ref<HTMLElement>()
const enabled = computed(() => props.tabs.filter((t) => !t.disabled))

// Roving tabindex with arrow keys, per the WAI-ARIA tabs pattern (automatic activation).
async function onKeydown(event: KeyboardEvent) {
  const index = enabled.value.findIndex((t) => t.key === active.value)
  const last = enabled.value.length - 1
  const [prevKey, nextKey] = props.orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  const next = { [nextKey]: index + 1, [prevKey]: index - 1, Home: 0, End: last }[event.key]
  if (next === undefined) return
  event.preventDefault()
  const tab = enabled.value[(next + enabled.value.length) % enabled.value.length]
  if (!tab) return
  active.value = tab.key
  await nextTick()
  list.value?.querySelector<HTMLElement>(`[data-key="${tab.key}"]`)?.focus()
}
</script>

<template>
  <div class="vk-tabs" :class="`vk-tabs--${orientation}`">
    <div ref="list" class="vk-tabs__list" role="tablist" :aria-label="label" :aria-orientation="orientation" @keydown="onKeydown">
      <button
        v-for="tab in tabs"
        :id="`${id}-tab-${tab.key}`"
        :key="tab.key"
        type="button"
        role="tab"
        class="vk-tabs__tab"
        :data-key="tab.key"
        :aria-selected="tab.key === active"
        :aria-controls="`${id}-panel-${tab.key}`"
        :tabindex="tab.key === active ? 0 : -1"
        :disabled="tab.disabled"
        @click="active = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <template v-for="tab in tabs" :key="tab.key">
      <div
        v-if="tab.key === active"
        :id="`${id}-panel-${tab.key}`"
        class="vk-tabs__panel"
        role="tabpanel"
        :aria-labelledby="`${id}-tab-${tab.key}`"
        tabindex="0"
      >
        <slot :name="tab.key" :tab="tab" />
      </div>
    </template>
  </div>
</template>

<style>
.vk-tabs {
  font-family: var(--vk-font);
  color: var(--vk-text);
}
.vk-tabs__list {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--vk-border);
  overflow-x: auto;
}
.vk-tabs__tab {
  padding: 8px 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--vk-muted);
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
}
.vk-tabs__tab[aria-selected='true'] {
  color: var(--vk-text);
  border-bottom-color: var(--vk-accent);
  font-weight: 600;
}
.vk-tabs__tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.vk-tabs__tab:focus-visible {
  outline: none;
  box-shadow: var(--vk-focus);
  border-radius: 4px;
}
.vk-tabs__panel {
  padding: 16px 0;
}
.vk-tabs--vertical {
  display: flex;
  gap: 16px;
}
.vk-tabs--vertical .vk-tabs__list {
  flex-direction: column;
  border-bottom: 0;
  border-right: 1px solid var(--vk-border);
}
.vk-tabs--vertical .vk-tabs__tab {
  border-bottom: 0;
  border-right: 2px solid transparent;
  text-align: left;
}
.vk-tabs--vertical .vk-tabs__tab[aria-selected='true'] {
  border-right-color: var(--vk-accent);
}
.vk-tabs--vertical .vk-tabs__panel {
  padding: 0;
  flex: 1;
}
.vk-tabs__panel:focus-visible {
  outline: none;
  box-shadow: var(--vk-focus);
}
</style>
