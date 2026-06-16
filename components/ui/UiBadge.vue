<script setup lang="ts">
defineProps<{
  variant?: 'gold' | 'ivory' | 'success' | 'danger' | 'theme'
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <span
    class="inline-flex items-center rounded-imperial tracking-[2px] uppercase font-sans font-light whitespace-nowrap"
    :class="{
      'py-[2px] px-2 text-[9px]': (size || 'md') === 'sm',
      'py-1 px-[10px] text-[10px]': (size || 'md') === 'md',
      'bg-gold/10 border border-gold text-gold': (variant || 'gold') === 'gold',
      'bg-ivory/5 border border-ivory/20 text-ivory-muted': (variant || 'gold') === 'ivory',
      'bg-theme-football/10 border border-theme-football text-theme-football/70': (variant || 'gold') === 'success',
      'bg-theme-politics/10 border border-theme-politics text-theme-politics/70': (variant || 'gold') === 'danger',
      'border [background:var(--theme-bg,rgba(var(--color-gold),0.1))] [border-color:var(--theme-color,var(--color-gold))] [color:var(--theme-color,var(--color-gold))]': (variant || 'gold') === 'theme',
    }"
  >
    <slot />
  </span>
</template>
