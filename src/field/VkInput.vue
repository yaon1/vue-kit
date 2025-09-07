<script setup lang="ts">
import VkField from './VkField.vue'

defineOptions({ inheritAttrs: false })
defineProps<{ label: string; hint?: string; error?: string; required?: boolean; type?: string }>()
const value = defineModel<string>({ default: '' })
</script>

<template>
  <VkField :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id, describedby, invalid }">
      <input
        :id="id"
        v-model="value"
        v-bind="$attrs"
        class="vk-control"
        :type="type ?? 'text'"
        :required="required"
        :aria-describedby="describedby"
        :aria-invalid="invalid || undefined"
      />
    </template>
  </VkField>
</template>
