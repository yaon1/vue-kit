<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ value?: number | null; max?: number; label: string; showValue?: boolean }>(), {
  value: null,
  max: 100,
  showValue: false,
})
const percent = computed(() =>
  props.value === null ? null : Math.round((Math.min(Math.max(props.value, 0), props.max) / props.max) * 100),
)
</script>

<!-- value=null renders an indeterminate bar. -->
<template>
  <div class="vk-progress">
    <div
      class="vk-progress__track"
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="value ?? undefined"
    >
      <div
        class="vk-progress__bar"
        :class="{ 'is-indeterminate': percent === null }"
        :style="percent === null ? {} : { width: `${percent}%` }"
      />
    </div>
    <span v-if="showValue && percent !== null" class="vk-progress__value">{{ percent }}%</span>
  </div>
</template>

<style>
.vk-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  font: 13px var(--vk-font);
  color: var(--vk-muted);
}
.vk-progress__track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--vk-border);
  overflow: hidden;
}
.vk-progress__bar {
  height: 100%;
  background: var(--vk-accent);
  transition: width 0.2s;
}
.vk-progress__bar.is-indeterminate {
  width: 40%;
  animation: vk-progress 1.2s ease-in-out infinite;
}
@keyframes vk-progress {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
.vk-progress__value {
  font-variant-numeric: tabular-nums;
  min-width: 3ch;
  text-align: right;
}
</style>
