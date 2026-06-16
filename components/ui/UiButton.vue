<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  full?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  full: false,
})

const variantClasses: Record<string, string> = {
  primary: 'bg-gold text-noir border border-gold font-bold hover:bg-gold-light hover:border-gold-light',
  secondary: 'bg-transparent text-gold border border-gold font-medium hover:bg-gold/[0.08]',
  danger: 'bg-theme-politics text-ivory border border-theme-politics font-bold hover:bg-theme-politics/90 hover:border-theme-politics/90',
  ghost: 'bg-transparent text-ivory-muted border border-ivory/20 font-medium hover:text-ivory hover:border-gold',
}

const sizeClasses: Record<string, string> = {
  sm: 'py-[7px] px-4 text-[10px]',
  md: 'py-[11px] px-7 text-[11px]',
  lg: 'py-[15px] px-10 text-[13px]',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      'inline-flex items-center justify-center gap-2',
      'font-sans tracking-[1.5px] uppercase cursor-pointer rounded-none whitespace-nowrap select-none',
      'transition-all duration-[150ms]',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      { 'w-full': full },
    ]"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <slot v-else />
  </button>
</template>

<style scoped>
.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid color-mix(in srgb, currentColor 30%, transparent);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
