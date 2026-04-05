<script setup lang="ts">
import VkSpinner from '../spinner/VkSpinner.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'secondary', size: 'md', type: 'button', loading: false, disabled: false, block: false },
)
defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :type="type"
    class="vk-button"
    :class="[`vk-button--${variant}`, `vk-button--${size}`, { 'vk-button--block': block, 'is-loading': loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="$emit('click', $event)"
  >
    <VkSpinner v-if="loading" :size="props.size === 'sm' ? 12 : 14" label="" aria-hidden="true" />
    <slot name="icon" />
    <span class="vk-button__label"><slot /></span>
  </button>
</template>

<style>
.vk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  background: var(--vk-bg);
  color: var(--vk-text);
  font: inherit;
  font-family: var(--vk-font);
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.vk-button:hover:not(:disabled) {
  background: var(--vk-surface);
}
.vk-button:focus-visible {
  outline: none;
  box-shadow: var(--vk-focus);
}
.vk-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.vk-button--sm {
  padding: 4px 10px;
  font-size: 13px;
}
.vk-button--md {
  padding: 8px 14px;
  font-size: 14px;
}
.vk-button--lg {
  padding: 11px 18px;
  font-size: 16px;
}
.vk-button--block {
  display: flex;
  width: 100%;
}
.vk-button--primary {
  background: var(--vk-accent);
  border-color: var(--vk-accent);
  color: var(--vk-accent-text);
}
.vk-button--primary:hover:not(:disabled) {
  background: var(--vk-accent);
  filter: brightness(1.08);
}
.vk-button--ghost {
  border-color: transparent;
  background: transparent;
}
.vk-button--danger {
  color: var(--vk-danger);
  border-color: currentColor;
}
</style>
