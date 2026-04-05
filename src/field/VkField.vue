<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{ label: string; hint?: string; error?: string; required?: boolean }>()
const id = useId()
// The hint is hidden while an error is shown, so only reference what is rendered.
const describedby = computed(() => (props.error ? `${id}-error` : props.hint ? `${id}-hint` : undefined))
</script>

<!-- Label, hint and error wiring shared by every input; the control comes from the default slot. -->
<template>
  <div class="vk-field" :class="{ 'has-error': !!error }">
    <label :for="id" class="vk-field__label">
      {{ label }}<span v-if="required" class="vk-field__required" aria-hidden="true"> *</span>
    </label>
    <slot :id="id" :describedby="describedby" :invalid="!!error" />
    <p v-if="hint && !error" :id="`${id}-hint`" class="vk-field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="vk-field__error">{{ error }}</p>
  </div>
</template>

<style>
.vk-field {
  display: grid;
  gap: 4px;
  font-family: var(--vk-font);
  color: var(--vk-text);
}
.vk-field__label {
  font-size: 14px;
  font-weight: 500;
}
.vk-field__required {
  color: var(--vk-danger);
}
.vk-field__hint,
.vk-field__error {
  margin: 0;
  font-size: 12px;
}
.vk-field__hint {
  color: var(--vk-muted);
}
.vk-field__error {
  color: var(--vk-danger);
}
.vk-control {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid var(--vk-border);
  border-radius: var(--vk-radius);
  background: var(--vk-bg);
  color: inherit;
  font: inherit;
}
.vk-control:focus {
  outline: none;
  border-color: var(--vk-accent);
  box-shadow: var(--vk-focus);
}
.vk-field.has-error .vk-control {
  border-color: var(--vk-danger);
}
</style>
