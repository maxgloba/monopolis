<template>
  <div
    class="game-piece"
    :class="[`game-piece--${size}`, `game-piece--${pieceTheme}`, { 'game-piece--animated': animated }]"
    :title="pieceId"
  >
    <span class="game-piece__initials">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const PIECE_THEMES: Record<string, string> = {
  // Football
  arshavin: 'football',
  dzuba: 'football',
  akinfeev: 'football',
  cherchesov: 'football',
  // Hockey
  ovechkin: 'hockey',
  malkin: 'hockey',
  datsiuk: 'hockey',
  kaprizov: 'hockey',
  // Empire
  peter1: 'empire',
  catherine2: 'empire',
  nicholas2: 'empire',
  stolypin: 'empire',
  // Politics
  gorbachev: 'politics',
  yeltsin: 'politics',
  zhirinovsky: 'politics',
  putin: 'politics',
}

const props = withDefaults(defineProps<{
  pieceId: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}>(), {
  size: 'md',
  animated: false,
})

const pieceTheme = computed(() => PIECE_THEMES[props.pieceId] ?? 'football')

const initials = computed(() => {
  const id = props.pieceId
  // Split by digit boundary or camelCase
  const parts = id.split(/(?=[A-Z0-9])/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return id.slice(0, 2).toUpperCase()
})
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

@keyframes goldPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba($gold, 0.7), 0 0 6px rgba($gold, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba($gold, 0), 0 0 12px rgba($gold, 0.8);
  }
}

.game-piece {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-round;
  border: 2px solid rgba($gold, 0.5);
  color: $ivory;
  font-family: $font-serif;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  user-select: none;
  cursor: default;
  transition: box-shadow $transition-normal;

  // Sizes
  &--sm {
    width: 20px;
    height: 20px;
    font-size: 7px;
    border-width: 1px;
  }

  &--md {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

  &--lg {
    width: 40px;
    height: 40px;
    font-size: 14px;
    border-width: 3px;
  }

  // Themes
  &--football {
    background-color: $theme-football;
  }

  &--hockey {
    background-color: $theme-hockey;
  }

  &--empire {
    background-color: $theme-empire;
  }

  &--politics {
    background-color: $theme-politics;
  }

  // Animation
  &--animated {
    animation: goldPulse 1.4s ease-in-out infinite;
    border-color: $gold;
  }

  &__initials {
    display: block;
    pointer-events: none;
  }
}
</style>
