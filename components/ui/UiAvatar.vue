<script setup lang="ts">
const props = defineProps<{
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const COLORS = ['#1E6B2E','#1A237E','#7B1FA2','#B71C1C','#B8860B','#0F6E56']

function getBg(name: string): string {
  return COLORS[name.charCodeAt(0) % COLORS.length]
}

const sizeClass: Record<string, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-11 h-11',
  lg: 'w-16 h-16',
}
</script>

<template>
  <div class="rounded-full overflow-hidden flex-shrink-0 border border-gold-faint" :class="sizeClass[size || 'md']">
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover" />
    <div v-else class="w-full h-full flex items-center justify-center font-serif text-sm font-bold text-ivory tracking-[1px]" :style="{ background: getBg(name) }">
      {{ getInitials(name) }}
    </div>
  </div>
</template>
