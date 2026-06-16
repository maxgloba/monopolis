<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => emit('update:modelValue', false)

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue) close()
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 bg-noir/85 backdrop-blur-sm z-[100] flex items-center justify-center p-6" @click.self="close">
        <div
          class="modal-box relative bg-noir-card border border-noir-border rounded-card w-full max-h-[90vh] overflow-y-auto"
          :class="{
            'max-w-[400px]': (size || 'md') === 'sm',
            'max-w-[560px]': (size || 'md') === 'md',
            'max-w-[800px]': (size || 'md') === 'lg',
          }"
        >
          <div class="flex items-center justify-between px-6 pt-5">
            <h2 v-if="title" class="font-serif text-[20px] text-gold tracking-[2px]">{{ title }}</h2>
            <button class="bg-transparent border-0 text-ivory-faint text-[18px] cursor-pointer p-1 leading-none hover:text-gold" @click="close">✕</button>
          </div>
          <div class="px-6 py-5">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 pb-5 flex gap-3 justify-end border-t border-noir-border pt-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, theme('colors.gold.DEFAULT'), transparent);
}

.modal-enter-active,
.modal-leave-active { transition: opacity 200ms ease; }
.modal-enter-active .modal-box,
.modal-leave-active .modal-box { transition: transform 200ms ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box,
.modal-leave-to .modal-box { transform: scale(0.95) translateY(8px); }
</style>
