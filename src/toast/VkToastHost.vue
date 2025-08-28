<script setup lang="ts">
import { useToast } from './useToast'

withDefaults(defineProps<{ position?: 'top-right' | 'bottom-right' | 'bottom-center' }>(), {
  position: 'bottom-right',
})

const { toasts, dismiss, pause, resume } = useToast()
</script>

<template>
  <section class="vk-toasts" :class="`vk-toasts--${position}`" aria-label="Notifications">
    <TransitionGroup name="vk-toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="vk-toast"
        :class="`vk-toast--${toast.kind}`"
        :role="toast.kind === 'error' ? 'alert' : 'status'"
        :aria-live="toast.kind === 'error' ? 'assertive' : 'polite'"
        @mouseenter="pause(toast.id)"
        @mouseleave="resume(toast.id)"
        @focusin="pause(toast.id)"
        @focusout="resume(toast.id)"
      >
        <span class="vk-toast__message">{{ toast.message }}</span>
        <button
          v-if="toast.action"
          type="button"
          class="vk-toast__action"
          @click="toast.action.onClick(); dismiss(toast.id)"
        >
          {{ toast.action.label }}
        </button>
        <button type="button" class="vk-toast__close" aria-label="Dismiss" @click="dismiss(toast.id)">×</button>
      </div>
    </TransitionGroup>
  </section>
</template>

<style>
.vk-toasts {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  max-width: min(420px, 100vw);
  font-family: var(--vk-font);
  pointer-events: none;
}
.vk-toasts--top-right { top: 0; right: 0; }
.vk-toasts--bottom-right { bottom: 0; right: 0; flex-direction: column-reverse; }
.vk-toasts--bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); flex-direction: column-reverse; }

.vk-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--vk-radius);
  border-left: 4px solid var(--vk-accent);
  background: var(--vk-bg);
  color: var(--vk-text);
  box-shadow: var(--vk-shadow);
  pointer-events: auto;
}
.vk-toast--success { border-left-color: var(--vk-success); }
.vk-toast--warning { border-left-color: var(--vk-warning); }
.vk-toast--error { border-left-color: var(--vk-danger); }
.vk-toast__message { flex: 1; }
.vk-toast__action,
.vk-toast__close {
  border: 0;
  background: none;
  color: var(--vk-accent);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
}
.vk-toast__close { color: var(--vk-muted); font-size: 18px; line-height: 1; }
.vk-toast__action:focus-visible,
.vk-toast__close:focus-visible { outline: none; box-shadow: var(--vk-focus); }

.vk-toast-enter-active,
.vk-toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.vk-toast-enter-from,
.vk-toast-leave-to { opacity: 0; transform: translateY(8px); }

@media (prefers-reduced-motion: reduce) {
  .vk-toast-enter-active,
  .vk-toast-leave-active { transition: none; }
}
</style>
