<script setup lang="ts">
import { ref, watchPostEffect } from 'vue'

const props = withDefaults(defineProps<{ label: string; indeterminate?: boolean; disabled?: boolean }>(), {
  indeterminate: false,
  disabled: false,
})
const checked = defineModel<boolean>({ default: false })
const input = ref<HTMLInputElement>()

// `indeterminate` exists only as a DOM property, so sync it manually.
watchPostEffect(() => {
  if (input.value) input.value.indeterminate = props.indeterminate
})
</script>

<template>
  <label class="vk-checkbox" :class="{ 'is-disabled': disabled }">
    <input
      ref="input"
      v-model="checked"
      type="checkbox"
      class="vk-checkbox__input"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : undefined"
    />
    <span>{{ label }}</span>
  </label>
</template>

<style>
.vk-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--vk-font);
  color: var(--vk-text);
  cursor: pointer;
}
.vk-checkbox.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.vk-checkbox__input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--vk-accent);
}
.vk-checkbox__input:focus-visible {
  outline: none;
  box-shadow: var(--vk-focus);
}
</style>
