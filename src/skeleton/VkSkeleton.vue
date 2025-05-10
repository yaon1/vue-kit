<script setup lang="ts">
withDefaults(defineProps<{ lines?: number; width?: string; height?: string; circle?: boolean }>(), {
  lines: 1,
  width: '100%',
  height: '14px',
  circle: false,
})
</script>

<template>
  <span class="vk-skeleton" aria-hidden="true">
    <span
      v-for="i in lines"
      :key="i"
      class="vk-skeleton__line"
      :class="{ 'is-circle': circle }"
      :style="{ width: circle ? height : i === lines && lines > 1 ? '60%' : width, height }"
    />
  </span>
</template>

<style>
.vk-skeleton { display: grid; gap: 8px; }
.vk-skeleton__line {
  display: block;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--vk-surface) 25%, var(--vk-border) 37%, var(--vk-surface) 63%);
  background-size: 400% 100%;
  animation: vk-shimmer 1.4s ease infinite;
}
.vk-skeleton__line.is-circle { border-radius: 50%; }
@keyframes vk-shimmer { from { background-position: 100% 50%; } to { background-position: 0 50%; } }
@media (prefers-reduced-motion: reduce) { .vk-skeleton__line { animation: none; } }
</style>
