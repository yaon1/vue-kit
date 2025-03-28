<script setup lang="ts">
import { ref, useId } from 'vue'

withDefaults(defineProps<{ text: string; placement?: 'top' | 'bottom' | 'left' | 'right'; delay?: number }>(), {
  placement: 'top',
  delay: 300,
})

const id = useId()
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function show(delay: number) {
  clearTimeout(timer)
  timer = setTimeout(() => (visible.value = true), delay)
}

function hide() {
  clearTimeout(timer)
  visible.value = false
}
</script>

<!-- Describes the wrapped control via aria-describedby; shows on hover and on keyboard focus, hides on Escape. -->
<template>
  <span
    class="vk-tooltip"
    @mouseenter="show(delay)"
    @mouseleave="hide"
    @focusin="show(0)"
    @focusout="hide"
    @keydown.esc="hide"
  >
    <slot :describedby="id" />
    <span v-show="visible" :id="id" role="tooltip" class="vk-tooltip__bubble" :class="`is-${placement}`">{{ text }}</span>
  </span>
</template>

<style>
.vk-tooltip { position: relative; display: inline-flex; }
.vk-tooltip__bubble {
  position: absolute;
  z-index: 20;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--vk-text);
  color: var(--vk-bg);
  font: 12px/1.4 var(--vk-font);
  white-space: nowrap;
  pointer-events: none;
}
.vk-tooltip__bubble.is-top { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.vk-tooltip__bubble.is-bottom { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.vk-tooltip__bubble.is-left { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
.vk-tooltip__bubble.is-right { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
</style>
