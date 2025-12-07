<script setup lang="ts">
defineProps<{ items: readonly { label: string; href?: string }[]; label?: string }>()
</script>

<template>
  <nav class="vk-breadcrumbs" :aria-label="label ?? 'Breadcrumb'">
    <ol>
      <li v-for="(item, i) in items" :key="i">
        <a v-if="item.href && i < items.length - 1" :href="item.href">{{ item.label }}</a>
        <span v-else :aria-current="i === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style>
.vk-breadcrumbs ol { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; font: 14px var(--vk-font); color: var(--vk-muted); }
.vk-breadcrumbs li + li::before { content: '/'; margin-right: 6px; opacity: 0.6; }
.vk-breadcrumbs a { color: var(--vk-accent); text-decoration: none; }
.vk-breadcrumbs a:hover { text-decoration: underline; }
.vk-breadcrumbs [aria-current='page'] { color: var(--vk-text); }
</style>
