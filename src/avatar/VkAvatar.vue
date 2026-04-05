<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ name: string; src?: string; size?: number }>(), { src: undefined, size: 36 })
const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join(''),
)

// Stable colour per name so the same person always gets the same avatar.
const hue = computed(() => [...props.name].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7))
</script>

<template>
  <span class="vk-avatar" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.4}px`, '--hue': hue }">
    <img v-if="src && !failed" :src="src" :alt="name" @error="failed = true" />
    <span v-else role="img" :aria-label="name">{{ initials }}</span>
  </span>
</template>

<style>
.vk-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  background: hsl(var(--hue) 55% 45%);
  color: #fff;
  font-family: var(--vk-font);
  font-weight: 600;
}
.vk-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
