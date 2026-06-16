<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  prefix?: string
  suffix?: string
  showPasswordToggle?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text'
  return props.type || 'text'
})
</script>

<template>
  <div class="flex flex-col gap-[6px]">
    <label v-if="label" class="font-sans text-label font-light tracking-[3px] uppercase text-gold-muted">{{ label }}</label>
    <div
      class="flex items-center bg-noir-surface border border-noir-border border-b border-b-gold rounded-imperial transition-all duration-[150ms]"
      :class="{
        'border-b-theme-politics': error,
        'opacity-50 pointer-events-none': disabled
      }"
    >
      <span v-if="prefix" class="px-3 text-gold-muted text-label tracking-[1px] shrink-0">{{ prefix }}</span>
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="field-input flex-1 py-[11px] px-[14px] bg-transparent border-none outline-none text-ivory font-sans text-body"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="suffix && !showPasswordToggle" class="px-3 text-gold-muted text-label tracking-[1px] shrink-0">{{ suffix }}</span>
      <button
        v-if="showPasswordToggle && type === 'password'"
        type="button"
        class="px-3 bg-transparent border-none cursor-pointer text-gold-muted text-[14px] hover:text-gold"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? '👁' : '👁‍🗨' }}
      </button>
    </div>
    <p v-if="error" class="text-label tracking-[1px] text-theme-politics">⚠ {{ error }}</p>
    <p v-else-if="hint" class="text-label tracking-[1px] text-ivory-faint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field-input::placeholder {
  color: theme('colors.ivory.faint');
}

.field-input:-webkit-autofill,
.field-input:-webkit-autofill:hover,
.field-input:-webkit-autofill:focus {
  -webkit-text-fill-color: theme('colors.ivory.DEFAULT');
  -webkit-box-shadow: 0 0 0 1000px theme('colors.noir.surface') inset;
  transition: background-color 5000s ease-in-out 0s;
}

div:focus-within {
  border-color: theme('colors.gold.DEFAULT');
  box-shadow: theme('boxShadow.gold-sm');
}

div.border-b-theme-politics:focus-within {
  box-shadow: 0 0 8px rgba(var(--color-theme-politics), 0.2);
}
</style>
