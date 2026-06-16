<script setup lang="ts">
const props = defineProps<{
  players: {
    id: number; userId: number | null; nickname: string; pieceId: string
    coins: number; inJail: boolean; isBankrupt: boolean; isActive: boolean; isBot: boolean
  }[]
  currentPlayerIdx: number
  myPlayerId: number | null
}>()

const emit = defineEmits<{ 'player-click': [{ player: any, idx: number, x: number, y: number }] }>()

const PLAYER_COLORS = ['#D4A017', '#4CAF50', '#2196F3', '#E91E63']

function onPlayerClick(player: any, idx: number, e: MouseEvent) {
  if (player.id === props.myPlayerId) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  emit('player-click', { player, idx, x: rect.left - 196, y: rect.top })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(player, i) in players"
      :key="player.id"
      class="flex items-center gap-2 pr-3 bg-noir-card border border-noir-border rounded-card transition-all duration-[150ms] relative overflow-hidden cursor-pointer"
      :class="{
        'panel-active': i === currentPlayerIdx && !player.isBankrupt,
        'opacity-[0.35] grayscale': player.isBankrupt,
      }"
      :style="{ '--pc': PLAYER_COLORS[i % 4] }"
      @click="onPlayerClick(player, i, $event)"
    >
      <!-- Цветная полоска слева -->
      <div class="w-1 self-stretch flex-shrink-0 rounded-l" style="background: var(--pc);"></div>

      <!-- Аватар-кружок цвета игрока -->
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
        style="background: var(--pc); color: rgba(0,0,0,0.85);"
      >
        {{ player.nickname.slice(0, 1).toUpperCase() }}
      </div>

      <div class="flex flex-col gap-[2px] flex-1 min-w-0 py-1">
        <span class="text-[12px] text-ivory tracking-[0.5px] whitespace-nowrap overflow-hidden text-ellipsis">
          {{ player.nickname }}
          <span v-if="player.id === myPlayerId" class="text-[10px] ml-1" style="color: var(--pc);">(вы)</span>
        </span>
        <span class="text-[13px] text-gold leading-none font-bold">🪙 {{ player.coins.toLocaleString('ru') }}</span>
      </div>

      <!-- Статус и индикатор хода — правый верхний угол -->
      <div class="absolute top-[6px] right-2 flex flex-col items-end gap-[3px]">
        <div v-if="i === currentPlayerIdx && !player.isBankrupt" class="turn-indicator text-[8px] tracking-[2px] border rounded-imperial px-[5px] py-[2px]" style="color: var(--pc); border-color: var(--pc);">ХОД</div>
        <span v-if="player.inJail" class="text-[9px] text-ivory-faint">⛓ тюрьма</span>
        <span v-if="player.isBankrupt" class="text-[9px] text-theme-politics tracking-[1px] font-bold">БАНКРОТ</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-active {
  border-color: var(--pc);
  box-shadow: 0 0 14px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04);
  animation: panelPulse 2s ease-in-out infinite;
}

@keyframes panelPulse {
  0%, 100% { box-shadow: 0 0 8px color-mix(in srgb, var(--pc) 30%, transparent); }
  50%       { box-shadow: 0 0 20px color-mix(in srgb, var(--pc) 60%, transparent); }
}

.turn-indicator {
  animation: turnBlink 1s ease-in-out infinite;
}

@keyframes turnBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>
