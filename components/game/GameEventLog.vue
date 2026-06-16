<script setup lang="ts">
const props = defineProps<{
  events: { icon: string; text: string; time: string }[]
}>()

const listRef = ref<HTMLDivElement | null>(null)

watch(() => props.events.length, () => {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = 0
  })
})
</script>

<template>
  <div class="flex flex-col overflow-hidden">
    <div ref="listRef" class="overflow-y-auto flex flex-col gap-[6px]">
      <TransitionGroup name="log-item">
        <div v-for="(evt, i) in events.slice(0, 10)" :key="i" class="flex items-baseline gap-[6px]">
          <span class="text-[12px] shrink-0">{{ evt.icon }}</span>
          <span class="text-[12px] text-ivory-muted flex-1">{{ evt.text }}</span>
          <span class="text-[10px] text-ivory-faint shrink-0">{{ evt.time }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.log-item-enter-active { animation: slideIn 200ms ease; }
@keyframes slideIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
</style>
