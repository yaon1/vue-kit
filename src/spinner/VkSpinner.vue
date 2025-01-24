<script setup lang="ts">
withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 16, label: 'Loading' })
</script>

<template>
  <span class="vk-spinner" role="status" :aria-label="label" :style="{ width: `${size}px`, height: `${size}px` }" />
</template>

<style>
.vk-spinner {
  display: inline-block;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: vk-spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes vk-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .vk-spinner { animation-duration: 2s; } }
</style>
