<script setup lang="ts">
import { ref, useId, watch } from 'vue'
import { useFocusTrap } from '../composables/useFocusTrap'

const props = withDefaults(
  defineProps<{
    title: string
    /** Close on backdrop click */
    dismissible?: boolean
    width?: string
    /** Slide-in side panel instead of a centred dialog. */
    placement?: 'center' | 'right' | 'left'
  }>(),
  { dismissible: true, width: '480px', placement: 'center' },
)
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement>()
const titleId = useId()
useFocusTrap(dialog, open)

// The native <dialog> gives us top-layer rendering, ::backdrop, inert background and Esc handling.
watch(
  open,
  (value) => {
    const el = dialog.value
    if (!el) return
    if (value && !el.open) el.showModal?.() ?? el.setAttribute('open', '')
    if (!value && el.open) el.close?.() ?? el.removeAttribute('open')
  },
  { flush: 'post' },
)

function onClose() {
  open.value = false
  emit('close')
}

function onBackdrop(event: MouseEvent) {
  if (props.dismissible && event.target === dialog.value) onClose()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="vk-dialog"
    :class="`vk-dialog--${placement}`"
    :aria-labelledby="titleId"
    :style="{ width: `min(${width}, calc(100vw - 32px))` }"
    @close="onClose"
    @cancel.prevent="onClose"
    @click="onBackdrop"
  >
    <header class="vk-dialog__header">
      <h2 :id="titleId" class="vk-dialog__title">{{ title }}</h2>
      <button type="button" class="vk-dialog__close" aria-label="Close" @click="onClose">×</button>
    </header>
    <div class="vk-dialog__body"><slot /></div>
    <footer v-if="$slots.footer" class="vk-dialog__footer"><slot name="footer" :close="onClose" /></footer>
  </dialog>
</template>

<style>
.vk-dialog {
  padding: 0;
  border: 1px solid var(--vk-border);
  border-radius: calc(var(--vk-radius) * 1.5);
  background: var(--vk-bg);
  color: var(--vk-text);
  font-family: var(--vk-font);
  box-shadow: var(--vk-shadow);
}
.vk-dialog--right, .vk-dialog--left { margin: 0; height: 100dvh; max-height: none; border-radius: 0; }
.vk-dialog--right { margin-left: auto; animation: vk-slide-right 0.2s ease-out; }
.vk-dialog--left { margin-right: auto; animation: vk-slide-left 0.2s ease-out; }
@keyframes vk-slide-right { from { transform: translateX(100%); } }
@keyframes vk-slide-left { from { transform: translateX(-100%); } }
@media (prefers-reduced-motion: reduce) { .vk-dialog--right, .vk-dialog--left { animation: none; } }
@media (max-width: 600px) { .vk-dialog--center { margin-bottom: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0; } }
.vk-dialog::backdrop { background: rgb(0 0 0 / 0.45); }
.vk-dialog__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 0; }
.vk-dialog__title { margin: 0; font-size: 18px; }
.vk-dialog__close { border: 0; background: none; color: var(--vk-muted); font-size: 22px; cursor: pointer; border-radius: 4px; }
.vk-dialog__close:focus-visible { outline: none; box-shadow: var(--vk-focus); }
.vk-dialog__body { padding: 12px 20px 20px; }
.vk-dialog__footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--vk-border); }
</style>
