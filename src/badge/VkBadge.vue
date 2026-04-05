<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'; dot?: boolean; count?: number; max?: number }>(),
  {
    tone: 'neutral',
    dot: false,
    count: undefined,
    max: 99,
  },
)
const countText = computed(() => (props.count === undefined ? null : props.count > props.max ? `${props.max}+` : String(props.count)))
</script>

<template>
  <span class="vk-badge" :class="`vk-badge--${tone}`">
    <span v-if="dot" class="vk-badge__dot" aria-hidden="true" />
    <slot>{{ countText }}</slot>
  </span>
</template>

<style>
.vk-badge {
  --tone: var(--vk-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  font: 600 12px/18px var(--vk-font);
  color: var(--tone);
  background: color-mix(in srgb, var(--tone) 14%, transparent);
}
.vk-badge--accent {
  --tone: var(--vk-accent);
}
.vk-badge--success {
  --tone: var(--vk-success);
}
.vk-badge--warning {
  --tone: var(--vk-warning);
}
.vk-badge--danger {
  --tone: var(--vk-danger);
}
.vk-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
