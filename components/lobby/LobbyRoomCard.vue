<script setup lang="ts">
const props = defineProps<{
  room: {
    id: number
    theme: 'football' | 'hockey' | 'empire' | 'politics'
    gameType: 'virtual' | 'real_money'
    betAmount: string | null
    status: string
    maxPlayers: number
    hostUserId: number
    players?: { nickname: string; avatarUrl: string | null }[]
  }
  canDelete?: boolean
}>()

const emit = defineEmits<{ join: [id: number]; rejoin: [id: number]; 'join-room': [id: number]; delete: [id: number] }>()

const themeConfig = {
  football: { label: 'Футбол РПЛ',    icon: '⚽', color: '#1E6B2E' },
  hockey:   { label: 'Хоккей КХЛ',   icon: '🏒', color: '#1A237E' },
  empire:   { label: 'Российская Империя', icon: '👑', color: '#7B1FA2' },
  politics: { label: 'Политика',      icon: '🏛️', color: '#B71C1C' },
}

const theme     = computed(() => themeConfig[props.room.theme])
const players   = computed(() => props.room.players || [])
const empty     = computed(() => props.room.maxPlayers - players.value.length)
const isFull    = computed(() => players.value.length >= props.room.maxPlayers)
const isInGame  = computed(() => props.room.status === 'in_game')
</script>

<template>
  <div
    class="room-card relative bg-noir-card border border-noir-border rounded-card p-4 pb-0 overflow-hidden flex flex-col gap-[14px] transition-all duration-[150ms] hover:border-gold-muted"
    :class="isInGame ? 'border-gold/30 !border-t-gold' : ''"
    :style="{ '--theme': theme.color, 'border-top': '2px solid var(--theme)' }"
  >
    <div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(90deg, transparent, var(--theme), transparent)"></div>

    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-[2px]">
        <span class="font-sans text-[13px] font-medium text-ivory tracking-[0.5px]">{{ theme.icon }} {{ theme.label }}</span>
        <span class="font-sans text-[10px] text-ivory-faint tracking-[2px] font-normal uppercase">КОМНАТА #{{ room.id }}</span>
      </div>
      <div class="flex items-center gap-2">
        <UiBadge :variant="room.gameType === 'real_money' ? 'danger' : 'gold'" size="sm">
          {{ room.gameType === 'real_money' ? `${room.betAmount} ₽` : 'Монеты' }}
        </UiBadge>
        <button
          v-if="canDelete"
          class="room-delete-btn w-[22px] h-[22px] rounded-full border border-theme-politics/40 bg-transparent text-theme-politics text-[10px] cursor-pointer flex items-center justify-center transition-all duration-[150ms] flex-shrink-0 opacity-0 hover:bg-theme-politics/15 hover:border-theme-politics"
          title="Удалить комнату"
          @click.stop="emit('delete', room.id)"
        >✕</button>
      </div>
    </div>

    <div class="flex flex-col gap-2 flex-1">
      <div v-for="p in players" :key="p.nickname" class="flex items-center gap-2">
        <UiAvatar :name="p.nickname" :src="p.avatarUrl" size="xs" />
        <span class="text-[12px] text-ivory-muted tracking-[1px]">{{ p.nickname }}</span>
      </div>
      <div v-for="i in empty" :key="`e${i}`" class="flex items-center gap-2">
        <div class="w-6 h-6 border border-dashed border-noir-border rounded-full flex-shrink-0"></div>
        <span class="text-[12px] text-ivory-faint tracking-[1px]">Свободно</span>
      </div>
    </div>

    <div v-if="isInGame" class="flex items-center justify-center gap-[6px] text-[9px] font-sans font-medium tracking-[2px] text-theme-politics text-center">
      <span class="live-dot w-[7px] h-[7px] rounded-full bg-theme-politics flex-shrink-0" />
      ПРЯМОЙ ЭФИР
    </div>

    <div class="room-card-actions grid gap-2 pt-3 border-t border-noir-border -mx-4 px-4 pb-4" :class="isInGame ? 'grid-cols-2' : 'grid-cols-1'">
      <template v-if="isInGame">
        <UiButton variant="ghost" size="sm" :full="true" @click="emit('join-room', room.id)">
          Комната
        </UiButton>
        <UiButton variant="primary" size="sm" :full="true" @click="emit('rejoin', room.id)">
          Играть
        </UiButton>
      </template>
      <template v-else>
        <UiButton :variant="isFull ? 'ghost' : 'primary'" size="sm" :full="true" @click="emit('join', room.id)">
          {{ isFull ? 'Наблюдать' : 'Войти' }}
        </UiButton>
      </template>
    </div>
  </div>
</template>

<style scoped>
.room-card:hover .room-delete-btn {
  opacity: 1;
}

.live-dot {
  animation: livePulse 1.2s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(183, 28, 28, 0.6); }
  50%       { opacity: 0.7; box-shadow: 0 0 0 5px rgba(183, 28, 28, 0); }
}
</style>
