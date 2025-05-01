<script setup lang="ts">
const props = withDefaults(defineProps<{ tone?: 'info' | 'success' | 'warning' | 'danger'; title?: string; dismissible?: boolean }>(), {
  tone: 'info',
  title: undefined,
  dismissible: false,
})
defineEmits<{ dismiss: [] }>()

// Danger alerts interrupt screen readers; the rest are announced politely.
const role = props.tone === 'danger' ? 'alert' : 'status'
</script>

<template>
  <div class="vk-alert" :class="`vk-alert--${tone}`" :role="role">
    <div class="vk-alert__content">
      <strong v-if="title" class="vk-alert__title">{{ title }}</strong>
      <div><slot /></div>
    </div>
    <button v-if="dismissible" type="button" class="vk-alert__close" aria-label="Dismiss" @click="$emit('dismiss')">×</button>
  </div>
</template>

<style>
.vk-alert {
  --tone: var(--vk-accent);
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--tone) 40%, transparent);
  border-left-width: 4px;
  border-radius: var(--vk-radius);
  background: color-mix(in srgb, var(--tone) 8%, var(--vk-bg));
  color: var(--vk-text);
  font-family: var(--vk-font);
}
.vk-alert--success { --tone: var(--vk-success); }
.vk-alert--warning { --tone: var(--vk-warning); }
.vk-alert--danger { --tone: var(--vk-danger); }
.vk-alert__content { flex: 1; display: grid; gap: 2px; }
.vk-alert__close { border: 0; background: none; color: var(--vk-muted); font-size: 18px; cursor: pointer; align-self: flex-start; }
</style>
