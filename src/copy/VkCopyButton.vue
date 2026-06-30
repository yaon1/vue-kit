<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{ text: string; label?: string; copiedLabel?: string }>(), { label: 'Copy', copiedLabel: 'Copied' })
const emit = defineEmits<{ copied: []; error: [error: unknown] }>()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    emit('copied')
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1500)
  } catch (error) {
    emit('error', error)
  }
}
</script>

<template>
  <button type="button" class="vk-copy" :class="{ 'is-copied': copied }" @click="copy">
    <span aria-hidden="true">{{ copied ? '✓' : '⧉' }}</span>
    <span aria-live="polite">{{ copied ? copiedLabel : label }}</span>
  </button>
</template>

<style>
.vk-copy {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  background: var(--vk-bg);
  color: var(--vk-text);
  font: 13px var(--vk-font);
  cursor: pointer;
}
.vk-copy.is-copied {
  color: var(--vk-success);
  border-color: currentColor;
}
.vk-copy:focus-visible {
  outline: none;
  box-shadow: var(--vk-focus);
}
</style>
