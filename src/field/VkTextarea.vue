<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import VkField from './VkField.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ label: string; hint?: string; error?: string; autosize?: boolean; maxRows?: number }>(), {
  autosize: true,
  maxRows: 12,
  hint: undefined,
  error: undefined,
})
const value = defineModel<string>({ default: '' })
const el = ref<HTMLTextAreaElement>()

// Grow with content up to maxRows, then scroll.
async function resize() {
  if (!props.autosize || !el.value) return
  await nextTick()
  const area = el.value
  const lineHeight = parseFloat(getComputedStyle(area).lineHeight) || 20
  area.style.height = 'auto'
  area.style.height = `${Math.min(area.scrollHeight, lineHeight * props.maxRows)}px`
}
watch(value, resize, { immediate: true })
</script>

<template>
  <VkField :label="label" :hint="hint" :error="error">
    <template #default="{ id, describedby, invalid }">
      <textarea
        :id="id"
        ref="el"
        v-model="value"
        v-bind="$attrs"
        rows="3"
        class="vk-control vk-textarea"
        :aria-describedby="describedby"
        :aria-invalid="invalid || undefined"
      />
    </template>
  </VkField>
</template>

<style>
.vk-textarea {
  resize: vertical;
  line-height: 1.5;
}
</style>
