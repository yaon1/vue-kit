<script setup lang="ts">
defineProps<{ title: string; description?: string; icon?: string }>()
</script>

<template>
  <div class="vk-empty">
    <div v-if="icon" class="vk-empty__icon" aria-hidden="true">{{ icon }}</div>
    <h3 class="vk-empty__title">{{ title }}</h3>
    <p v-if="description" class="vk-empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="vk-empty__actions"><slot /></div>
  </div>
</template>

<style>
.vk-empty { display: grid; justify-items: center; gap: 8px; padding: 40px 16px; text-align: center; font-family: var(--vk-font); color: var(--vk-text); }
.vk-empty__icon { font-size: 36px; opacity: 0.7; }
.vk-empty__title { margin: 0; font-size: 17px; }
.vk-empty__description { margin: 0; max-width: 42ch; color: var(--vk-muted); }
.vk-empty__actions { margin-top: 8px; display: flex; gap: 8px; }
</style>
