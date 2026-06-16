<script setup lang="ts">
const { toasts, remove } = useToast()

const icons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'i',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="relative flex items-center gap-[10px] px-[18px] py-3 bg-noir-card border border-noir-border rounded-card cursor-pointer pointer-events-auto min-w-[280px] max-w-[400px]"
          :class="{
            'border-l-2 border-l-theme-football': toast.type === 'success',
            'border-l-2 border-l-theme-politics': toast.type === 'error',
            'border-l-2 border-l-gold': toast.type === 'warning',
            'border-l-2 border-l-theme-hockey': toast.type === 'info',
          }"
          @click="remove(toast.id)"
        >
          <span
            class="text-sm font-bold flex-shrink-0"
            :class="{
              'text-theme-football': toast.type === 'success',
              'text-theme-politics': toast.type === 'error',
              'text-gold': toast.type === 'warning',
              'text-[#5C6BC0]': toast.type === 'info',
            }"
          >{{ icons[toast.type] }}</span>
          <span class="text-[13px] text-ivory-muted leading-[1.4]">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { animation: slideUp 250ms ease; }
.toast-leave-active { animation: slideUp 200ms ease reverse; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
