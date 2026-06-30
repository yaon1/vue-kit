<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ keys: string }>()
// "mod" becomes ⌘ on Apple platforms and Ctrl elsewhere.
const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform ?? '')
const parts = computed(() => props.keys.split('+').map((k) => (k.trim().toLowerCase() === 'mod' ? (isApple ? '⌘' : 'Ctrl') : k.trim())))
</script>

<template>
  <span class="vk-kbd-group">
    <template v-for="(part, i) in parts" :key="i">
      <kbd class="vk-kbd">{{ part }}</kbd
      ><span v-if="i < parts.length - 1" aria-hidden="true">+</span>
    </template>
  </span>
</template>

<style>
.vk-kbd-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--vk-font);
  color: var(--vk-muted);
}
.vk-kbd {
  padding: 1px 6px;
  border: 1px solid var(--vk-border);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--vk-surface);
  color: var(--vk-text);
  font:
    12px ui-monospace,
    monospace;
}
</style>
