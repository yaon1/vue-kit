<script setup lang="ts" generic="V extends string | number">
import VkField from './VkField.vue'

defineOptions({ inheritAttrs: false })
defineProps<{ label: string; options: readonly { value: V; label: string; disabled?: boolean }[]; placeholder?: string; hint?: string; error?: string }>()
const value = defineModel<V | null>({ default: null })
</script>

<!-- Native select: best mobile UX and accessibility for short option lists; use VkCombobox for long ones. -->
<template>
  <VkField :label="label" :hint="hint" :error="error">
    <template #default="{ id, describedby, invalid }">
      <select :id="id" v-model="value" v-bind="$attrs" class="vk-control" :aria-describedby="describedby" :aria-invalid="invalid || undefined">
        <option v-if="placeholder" :value="null" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o.value" :value="o.value" :disabled="o.disabled">{{ o.label }}</option>
      </select>
    </template>
  </VkField>
</template>
