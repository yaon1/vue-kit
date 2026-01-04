<script setup lang="ts">
withDefaults(defineProps<{ as?: string; padding?: 'none' | 'sm' | 'md' }>(), { as: 'section', padding: 'md' })
</script>

<template>
  <component :is="as" class="vk-card" :class="`vk-card--${padding}`">
    <header v-if="$slots.header" class="vk-card__header"><slot name="header" /></header>
    <div class="vk-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="vk-card__footer"><slot name="footer" /></footer>
  </component>
</template>

<style>
.vk-card { border: 1px solid var(--vk-border); border-radius: calc(var(--vk-radius) * 1.5); background: var(--vk-bg); color: var(--vk-text); font-family: var(--vk-font); overflow: hidden; }
.vk-card__header, .vk-card__footer { padding: 12px 16px; background: var(--vk-surface); }
.vk-card__header { border-bottom: 1px solid var(--vk-border); font-weight: 600; }
.vk-card__footer { border-top: 1px solid var(--vk-border); }
.vk-card--md .vk-card__body { padding: 16px; }
.vk-card--sm .vk-card__body { padding: 10px; }
</style>
