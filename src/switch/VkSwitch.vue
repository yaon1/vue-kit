<script setup lang="ts">
withDefaults(defineProps<{ label: string; disabled?: boolean; description?: string }>(), { disabled: false, description: undefined })
const checked = defineModel<boolean>({ default: false })
</script>

<!-- A real checkbox with role="switch": native keyboard support, form participation and correct announcements. -->
<template>
  <label class="vk-switch" :class="{ 'is-disabled': disabled }">
    <input v-model="checked" class="vk-switch__input" type="checkbox" role="switch" :disabled="disabled" />
    <span class="vk-switch__track" aria-hidden="true"><span class="vk-switch__thumb" /></span>
    <span class="vk-switch__text">
      <span class="vk-switch__label">{{ label }}</span>
      <span v-if="description" class="vk-switch__description">{{ description }}</span>
    </span>
  </label>
</template>

<style>
.vk-switch {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  font-family: var(--vk-font);
  color: var(--vk-text);
  cursor: pointer;
}
.vk-switch.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.vk-switch__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
.vk-switch__track {
  flex: none;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: var(--vk-border);
  position: relative;
  transition: background 0.15s;
}
.vk-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s;
}
.vk-switch__input:checked + .vk-switch__track {
  background: var(--vk-accent);
}
.vk-switch__input:checked + .vk-switch__track .vk-switch__thumb {
  transform: translateX(16px);
}
.vk-switch__input:focus-visible + .vk-switch__track {
  box-shadow: var(--vk-focus);
}
.vk-switch__text {
  display: grid;
  gap: 2px;
}
.vk-switch__description {
  font-size: 13px;
  color: var(--vk-muted);
}
@media (prefers-reduced-motion: reduce) {
  .vk-switch__track,
  .vk-switch__thumb {
    transition: none;
  }
}
</style>
