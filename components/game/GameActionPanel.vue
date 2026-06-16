<script setup lang="ts">
const props = defineProps<{
  isMyTurn: boolean
  phase: 'roll' | 'action' | 'end'
  canBuy:     boolean
  currentCell?: { name: string; price?: number }
  lastDice: [number, number] | null
}>()

const emit = defineEmits<{
  roll: []
  buy:  []
  decline: []
  endTurn: []
}>()

const rolling = ref(false)

async function onRoll() {
  rolling.value = true
  emit('roll')
  setTimeout(() => rolling.value = false, 900)
}
</script>

<template>
  <Transition name="panel">
    <div
      v-if="isMyTurn"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-noir-card border border-gold rounded-card px-7 py-5 flex flex-col gap-[14px] items-center min-w-[280px] z-50"
    >
      <div class="panel-top-line" />
      <div class="font-serif text-[13px] text-gold tracking-[3px] uppercase">Ваш ход</div>

      <GameDice :dice="lastDice" :rolling="rolling" />

      <div class="flex flex-col gap-2 w-full">
        <UiButton v-if="phase === 'roll'" :full="true" @click="onRoll">
          🎲 Бросить кубики
        </UiButton>
        <template v-if="phase === 'action' && canBuy">
          <p class="text-[12px] text-ivory-muted text-center tracking-[1px]">{{ currentCell?.name }} — {{ currentCell?.price }} монет</p>
          <UiButton :full="true" @click="emit('buy')">Купить</UiButton>
          <UiButton variant="ghost" :full="true" @click="emit('decline')">Отказаться</UiButton>
        </template>
        <UiButton v-if="phase === 'end'" variant="secondary" :full="true" @click="emit('endTurn')">
          Завершить ход
        </UiButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.panel-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold, #c9a84c), transparent);
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 200ms, transform 200ms;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
