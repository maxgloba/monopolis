<script setup lang="ts">
const props = defineProps<{
  cell: {
    id: number
    name: string
    type: string
    price?: number
    rent?: number[]
    color?: string
    image?: string
    description?: string
    group?: number
  }
  property?: {
    ownerId: number | null
    houses: number
    hotel: boolean
    mortgaged: boolean
  } | null
  players?: { id: number; nickname: string; coins: number }[]
  myPlayerId?: number | null
  myCoins?: number
  canBuy?: boolean
}>()

const emit = defineEmits<{
  buy: []
  decline: []
  close: []
  trade: [targetPlayerId: number]
  buildHouse: [cellId: number]
  mortgage: [cellId: number]
}>()

const owner = computed(() => {
  if (!props.property?.ownerId || !props.players) return null
  return props.players.find(p => p.id === props.property!.ownerId) ?? null
})

const isMyProperty   = computed(() => props.property?.ownerId === props.myPlayerId)
const isOwnedByOther = computed(() => props.property?.ownerId != null && !isMyProperty.value)
const canAfford      = computed(() => (props.myCoins ?? 0) >= (props.cell.price ?? 0))
const canBuildHouse  = computed(() =>
  isMyProperty.value &&
  props.cell.type === 'property' &&
  !props.property?.hotel &&
  !props.property?.mortgaged &&
  (props.myCoins ?? 0) >= housePrice.value
)
const isMortgaged    = computed(() => props.property?.mortgaged ?? false)

const housePrice = computed(() => {
  // Стоимость дома ~50% от цены собственности
  if (!props.cell.price) return 0
  if (props.cell.price <= 120)  return 50
  if (props.cell.price <= 200)  return 100
  if (props.cell.price <= 280)  return 150
  if (props.cell.price <= 360)  return 200
  return 200
})

const currentRent = computed(() => {
  if (!props.cell.rent || !props.property) return props.cell.rent?.[0] ?? 0
  const { houses, hotel } = props.property
  if (hotel) return props.cell.rent[5] ?? props.cell.rent[props.cell.rent.length - 1]
  if (houses > 0) return props.cell.rent[houses] ?? 0
  return props.cell.rent[0]
})
</script>

<template>
  <div class="w-[340px] bg-noir-card border border-noir-border rounded-card overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto">
    <!-- Фото арены -->
    <div class="relative h-[180px] overflow-hidden shrink-0 prop-card-image" :style="{ '--color': cell.color || '#888' }">
      <img v-if="cell.image" :src="cell.image" :alt="cell.name" class="w-full h-full object-cover opacity-75" @error="($event.target as HTMLImageElement).style.display='none'" />
      <div class="absolute inset-0 flex items-center justify-center text-[64px] opacity-30">
        <span>🏟️</span>
      </div>
      <div class="prop-card-color-bar absolute bottom-0 left-0 right-0 h-[6px]"></div>
      <button
        class="absolute top-[10px] right-[10px] bg-black/60 border-0 rounded-full w-7 h-7 text-ivory cursor-pointer text-[12px] flex items-center justify-center hover:bg-black/85"
        @click="emit('close')"
      >✕</button>
      <div class="absolute bottom-[14px] left-4 right-4 font-serif text-[18px] text-ivory tracking-[0.5px] [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">{{ cell.name }}</div>
    </div>

    <!-- Тело карточки -->
    <div class="p-4 flex flex-col gap-3">
      <!-- Описание -->
      <p v-if="cell.description" class="text-[12px] text-ivory-muted leading-[1.5] m-0">{{ cell.description }}</p>

      <!-- Владелец -->
      <div v-if="property" class="flex items-center gap-2">
        <template v-if="owner">
          <div class="text-[10px] tracking-[1px] text-ivory-faint uppercase">Владелец</div>
          <div
            class="text-[13px] font-medium"
            :class="isMyProperty ? 'text-gold' : 'text-ivory'"
          >
            {{ isMyProperty ? 'Вы' : owner.nickname }}
          </div>
        </template>
        <template v-else>
          <div class="text-[10px] tracking-[1px] text-ivory-faint uppercase">Владелец</div>
          <div class="text-[13px] text-theme-football">Свободно</div>
        </template>
      </div>

      <!-- Улучшения -->
      <div v-if="property && cell.type === 'property'" class="flex gap-[6px]">
        <span
          v-for="i in 5" :key="i"
          class="text-[18px] transition-all duration-[150ms]"
          :class="i <= (property.hotel ? 5 : property.houses) ? 'opacity-100' : 'opacity-25'"
        >{{ i === 5 ? '🏨' : '🏠' }}</span>
      </div>

      <!-- Заложена -->
      <div v-if="property?.mortgaged" class="text-label text-theme-politics tracking-[1px]">⛔ Заложена</div>

      <!-- Таблица ренты -->
      <div v-if="cell.rent" class="bg-noir border border-noir-border rounded-imperial py-2">
        <div class="text-[9px] tracking-[2px] text-gold mb-1 px-3">ТАБЛИЦА РЕНТЫ</div>
        <div
          class="flex justify-between px-3 py-1 text-label text-ivory-muted border-b border-white/[0.03]"
          :class="{ 'bg-gold/[0.08]': !property?.houses && !property?.hotel }"
        >
          <span :class="{ 'text-gold': !property?.houses && !property?.hotel }">Без домов</span>
          <span :class="!property?.houses && !property?.hotel ? 'text-gold font-semibold' : 'text-ivory'" class="tabular-nums">{{ cell.rent[0] }}</span>
        </div>
        <div v-if="cell.type === 'property'" class="flex justify-between px-3 py-1 text-label text-ivory-muted border-b border-white/[0.03] opacity-50 italic">
          <span>Монополия ×2</span><span class="text-ivory tabular-nums">{{ cell.rent[0] * 2 }}</span>
        </div>
        <div
          v-if="cell.type === 'property'"
          class="flex justify-between px-3 py-1 text-label text-ivory-muted border-b border-white/[0.03]"
          :class="{ 'bg-gold/[0.08]': property?.houses === 1 }"
        >
          <span :class="{ 'text-gold': property?.houses === 1 }">🏠 1 дом</span>
          <span :class="property?.houses === 1 ? 'text-gold font-semibold' : 'text-ivory'" class="tabular-nums">{{ cell.rent[1] }}</span>
        </div>
        <div
          v-if="cell.type === 'property'"
          class="flex justify-between px-3 py-1 text-label text-ivory-muted border-b border-white/[0.03]"
          :class="{ 'bg-gold/[0.08]': property?.houses === 2 }"
        >
          <span :class="{ 'text-gold': property?.houses === 2 }">🏠🏠 2 дома</span>
          <span :class="property?.houses === 2 ? 'text-gold font-semibold' : 'text-ivory'" class="tabular-nums">{{ cell.rent[2] }}</span>
        </div>
        <div
          v-if="cell.type === 'property'"
          class="flex justify-between px-3 py-1 text-label text-ivory-muted border-b border-white/[0.03]"
          :class="{ 'bg-gold/[0.08]': property?.houses === 3 }"
        >
          <span :class="{ 'text-gold': property?.houses === 3 }">🏠×3</span>
          <span :class="property?.houses === 3 ? 'text-gold font-semibold' : 'text-ivory'" class="tabular-nums">{{ cell.rent[3] }}</span>
        </div>
        <div
          v-if="cell.type === 'property'"
          class="flex justify-between px-3 py-1 text-label text-ivory-muted border-b border-white/[0.03]"
          :class="{ 'bg-gold/[0.08]': property?.houses === 4 }"
        >
          <span :class="{ 'text-gold': property?.houses === 4 }">🏠×4</span>
          <span :class="property?.houses === 4 ? 'text-gold font-semibold' : 'text-ivory'" class="tabular-nums">{{ cell.rent[4] }}</span>
        </div>
        <div
          v-if="cell.type === 'property'"
          class="flex justify-between px-3 py-1 text-label border-b border-white/[0.03]"
          :class="property?.hotel ? 'bg-gold/[0.08]' : ''"
        >
          <span :class="property?.hotel ? 'text-gold' : 'text-gold-muted'">🏨 Отель</span>
          <span :class="property?.hotel ? 'text-gold font-semibold' : 'text-gold-muted'" class="tabular-nums">{{ cell.rent[5] }}</span>
        </div>
      </div>

      <!-- Цены строительства -->
      <div v-if="cell.type === 'property' && cell.price" class="text-label text-ivory-faint text-center">
        Дом: <strong class="text-ivory-muted">{{ housePrice }}</strong> монет &nbsp;·&nbsp; Отель: <strong class="text-ivory-muted">{{ housePrice * 5 }}</strong> монет
      </div>

      <!-- Цена покупки -->
      <div v-if="cell.price" class="text-[13px] text-ivory-muted text-center">
        Цена: <strong class="text-gold text-[16px]">{{ cell.price }}</strong> монет
      </div>

      <!-- Кнопки действий -->
      <div class="flex flex-col gap-2 mt-1">
        <!-- Покупка -->
        <template v-if="canBuy && !property?.ownerId">
          <UiButton :full="true" :disabled="!canAfford" @click="emit('buy')">
            {{ canAfford ? `Купить за ${cell.price} монет` : 'Недостаточно монет' }}
          </UiButton>
          <UiButton variant="ghost" :full="true" @click="emit('decline')">Отказаться → аукцион</UiButton>
        </template>

        <!-- Моя собственность — управление -->
        <template v-else-if="isMyProperty">
          <UiButton
            v-if="cell.type === 'property' && !property?.hotel && !isMortgaged"
            :full="true"
            :disabled="!canBuildHouse"
            @click="emit('buildHouse', cell.id)"
          >
            🏠 {{ property?.houses === 4 ? `Построить отель — ${housePrice * 5} монет` : `Построить дом — ${housePrice} монет` }}
          </UiButton>
          <UiButton
            v-if="!property?.houses && !property?.hotel"
            variant="ghost"
            :full="true"
            @click="emit('mortgage', cell.id)"
          >
            {{ isMortgaged ? '🔓 Выкупить из залога' : '🔒 Заложить' }}
          </UiButton>
        </template>

        <!-- Чужая собственность — сделка -->
        <template v-else-if="isOwnedByOther && owner">
          <UiButton variant="secondary" :full="true" @click="emit('trade', owner.id)">
            💼 Предложить сделку {{ owner.nickname }}
          </UiButton>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prop-card-image {
  background: linear-gradient(135deg, color-mix(in srgb, var(--color) 30%, #111), #111);
}

.prop-card-color-bar {
  background: var(--color, #888);
}
</style>
